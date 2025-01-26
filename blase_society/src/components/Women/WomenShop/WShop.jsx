import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import '../CSS/WShop.css';
import { Breadcrumb, Tooltip } from "flowbite-react";
import WNavbar from "../WNavbar";
import { HiHome } from "react-icons/hi";
import { BiFilterAlt } from "react-icons/bi";
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import DecryptedText from '../../../content/TextAnimations/DecryptedText/DecryptedText';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

const WShop = () => {
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

  useEffect(() => {
    const fetchProducts = async () => {
      const SHOPIFY_API_URL = "https://2499d0-e9.myshopify.com/api/2023-01/graphql.json";
      const SHOPIFY_ACCESS_TOKEN = "352164320ac49e869c945f919a199a85";

      try {
        const response = await axios.post(
          SHOPIFY_API_URL,
          {
            query: `
              query {
                products(first: 20, query: "tag:women") {
                  edges {
                    node {
                      id
                      title
                      handle
                      description
                      priceRange {
                        minVariantPrice {
                          amount
                          currencyCode
                        }
                      }
                      images(first: 2) {
                        edges {
                          node {
                            originalSrc
                          }
                        }
                      }
                      variants(first: 1) {
                        edges {
                          node {
                            id
                            price {
                              amount
                              currencyCode
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            `
          },
          {
            headers: {
              'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data.data && response.data.data.products) {
          const fetchedProducts = response.data.data.products.edges.map(({ node }) => ({
            id: node.id,
            handle: node.handle,
            name: node.title,
            description: node.description,
            price: parseFloat(node.priceRange.minVariantPrice.amount),
            image1: node.images.edges[0]?.node.originalSrc || '',
            image2: node.images.edges[1]?.node.originalSrc || '',
            variantId: node.variants.edges[0]?.node.id
          }));

          console.log('Fetched products:', fetchedProducts); // Debug log
          setProducts(fetchedProducts);
          setFilteredProducts(fetchedProducts);
        } else {
          throw new Error('No products data received');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search and filters
  useEffect(() => {
    let result = [...products];

    if (search) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    result = result.filter(product => 
      product.price >= filters.priceRange[0] && 
      product.price <= filters.priceRange[1]
    );

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

  const handleFilterClick = () => {
    setIsFilterOpen(true);
    toast.success('Filters opened');
  };

  return (
    <>
      <WNavbar />
      <div className="shop-container">
        <div className="shop-header">
          <Breadcrumb className="shop-breadcrumb">
            <Breadcrumb.Item href="/" icon={HiHome}>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Women's Shop</Breadcrumb.Item>
          </Breadcrumb>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="shop-title"
          >
            <DecryptedText text="WOMEN'S COLLECTION" />
          </motion.h1>
        </div>

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

              <button 
                className="apply-filters-btn"
                onClick={() => setIsFilterOpen(false)}
              >
                Apply Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <Link 
                to={`/women/product/${product.handle}`}
                className="product-card"
                key={product.id}
              >
                <div className="product-image-container">
                  <img src={product.image1} alt={product.name} className="product-image" />
                  <img src={product.image2 || product.image1} alt={product.name} className="product-image-hover" />
                </div>
                
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-price">₹{product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="empty-state">
              <p>Loading products...</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WShop;
