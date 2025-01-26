import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import './Shop.css';
import { Breadcrumb, Tooltip } from "flowbite-react";
import Navbar from "../Navbar";
import { HiHome, HiAdjustments } from "react-icons/hi";
import { AiOutlineSearch, AiOutlineShoppingCart, AiOutlineHeart, AiOutlineClose } from "react-icons/ai";
import { BiSort, BiFilterAlt } from "react-icons/bi";
import DecryptedText from '../../content/TextAnimations/DecryptedText/DecryptedText';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [900, 10000],
    categories: [],
    sizes: [],
    colors: [],
    sortBy: 'newest'
  });
  const [wishlist, setWishlist] = useState([]);

  // Fetch products from Shopify
  useEffect(() => {
    const fetchProducts = async () => {
      const store = '2499d0-e9';
      const token = '352164320ac49e869c945f919a199a85';

      try {
        const response = await axios.post(
          `https://${store}.myshopify.com/api/2023-01/graphql.json`,
          {
            query: `
                {
                  products(first: 20) {
                    edges {
                      node {
                        id
                        title
                        handle
                        description
                        priceRange {
                          minVariantPrice {
                            amount
                          }
                        }
                        images(first: 2) {
                          edges {
                            node {
                              src
                            }
                          }
                        }
                      }
                    }
                  }
                }
              `,
          },
          {
            headers: {
              'X-Shopify-Storefront-Access-Token': token,
              'Content-Type': 'application/json',
            },
          }
        );

        // Transform the data into a usable format
        const fetchedProducts = response.data.data.products.edges.map((edge) => {
          const product = edge.node;
          return {
            id: product.id,
            handle: product.handle,
            name: product.title,
            description: product.description,
            price: parseFloat(product.priceRange.minVariantPrice.amount),
            image1: product.images.edges[0]?.node.src || '',
            image2: product.images.edges[1]?.node.src || '',
          };
        });

        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching Shopify products:', error.message);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search and filters
  useEffect(() => {
    let result = [...products];

    // Search filter
    if (search) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Price range filter
    result = result.filter(product => 
      product.price >= filters.priceRange[0] && 
      product.price <= filters.priceRange[1]
    );

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter(product => 
        filters.categories.includes(product.category)
      );
    }

    // Sort products
    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [products, search, filters]);

  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleFilterClick = () => {
    setIsFilterOpen(true);
    toast.success('Filters opened');
  };

  return (
    <>
      <Navbar />
      <div className="shop-container">
        {/* Header Section */}
        <div className="shop-header">
          <Breadcrumb className="shop-breadcrumb">
            <Breadcrumb.Item href="/" icon={HiHome}>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Shop</Breadcrumb.Item>
          </Breadcrumb>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="shop-title"
          >
            <DecryptedText
              text="Discover Our Collection"
              animateOn="view"
              revealDirection="left"
              sequential={true}
              speed={70}
            />
          </motion.h1>
        </div>

        {/* Search and Filter Bar */}
        <div className="shop-controls">
          <div className="search-bar">
         
              <AiOutlineSearch className="search-icon" />
            
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-controls">
            <Tooltip content="Open filters" placement="top">
              <button 
                className="filter-button"
                onClick={handleFilterClick}
              >
                <BiFilterAlt /> Filters
              </button>
            </Tooltip>
            
            <Tooltip content="Sort products" placement="top">
              <select 
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({...prev, sortBy: e.target.value}))}
                className="sort-select"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </Tooltip>
          </div>
        </div>

        {/* Filter Sidebar */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div 
              className="filter-sidebar"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween' }}
            >
              <div className="filter-header">
                <h3>Filters</h3>
                <button onClick={() => setIsFilterOpen(false)}>
                  <AiOutlineClose />
                </button>
              </div>

              {/* Price Range Filter */}
              <div className="filter-section">
                <h4>Price Range</h4>
                <div className="price-range">
                  <input
                    type="range"
                    min="900"
                    max="20000"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                    }))}
                  />
                  <div className="price-inputs">
                    <input
                      type="number"
                      min="900"
                      max="10000"
                      value={filters.priceRange[0]}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        priceRange: [parseInt(e.target.value), prev.priceRange[1]]
                      }))}
                    />
                    <span>-</span>
                    <input
                      type="number"
                      min="900"
                      max="10000"
                      value={filters.priceRange[1]}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                      }))}
                    />
                  </div>
                </div>
              </div>

              {/* Category Filter */}
              <div className="filter-section">
                <h4>Categories</h4>
                {/* Add your category checkboxes here */}
              </div>

              {/* Size Filter */}
              <div className="filter-section">
                <h4>Sizes</h4>
                {/* Add your size options here */}
              </div>

              {/* Apply Filters Button */}
              <button 
                className="apply-filters-btn"
                onClick={() => setIsFilterOpen(false)}
              >
                Apply Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        <div className="product-grid">
          {filteredProducts.map(product => (
            <Link 
              to={`/product/${product.handle}`}
              className="product-card"
              key={product.id}
            >
              <div className="product-image-container">
                <img src={product.image1} alt={product.name} className="product-image" />
                <img src={product.image2} alt={product.name} className="product-image-hover" />
              </div>
              
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-price">₹{product.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="empty-state">
            <p>No products found matching your criteria</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Shop;
