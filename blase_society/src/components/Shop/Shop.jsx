import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import './Shop.css';
import { Breadcrumb } from "flowbite-react";
import Navbar from "../Navbar";
import { HiHome } from "react-icons/hi";
import Footer from '../Footer';
import { AiOutlineSearch, AiOutlineShoppingCart } from "react-icons/ai";
import DecryptedText from '../../content/TextAnimations/DecryptedText/DecryptedText';
import axios from 'axios';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('asc');
  const [search, setSearch] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);

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

  const handleSort = (e) => setSort(e.target.value);
  const handleSearch = (e) => setSearch(e.target.value.toLowerCase());
  const toggleCart = () => setIsCartOpen((prevState) => !prevState);

  const handleAddToCart = (variantId) => {
    // Implement add to cart functionality here
  };

  const filteredProducts = products
    .filter((product) => product.name.toLowerCase().includes(search))
    .sort((a, b) => (sort === 'asc' ? a.price - b.price : b.price - a.price));

  return (
    <>
      <Navbar />
      <div className="shop-container">
        <div className="shop-header flex-wrap">
          <div className="flex items-center">
            <div className="search-input-wrapper">
              <AiOutlineSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search products..."
                className="shop-search"
                value={search}
                onChange={handleSearch}
              />
            </div>
          </div>

          <div className="shop-controls">
            <select className="shop-sort" value={sort} onChange={handleSort}>
              <option value="asc">Sort by Price: Low to High</option>
              <option value="desc">Sort by Price: High to Low</option>
            </select>
            <button className="cart-toggle-btn" onClick={toggleCart}>
              <AiOutlineShoppingCart className="cart-icon" />
              <span className="cart-text">
                Cart (0) {/* Update this to reflect actual cart items if needed */}
              </span>
            </button>
          </div>
        </div>
        <Breadcrumb aria-label="Default breadcrumb example" className="w-full breadcrumbs">
          <Breadcrumb.Item href="#" icon={HiHome}>
            Home
          </Breadcrumb.Item>
          <Breadcrumb.Item href="#">Shop</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ marginTop: '2rem' }}>
          <DecryptedText
            text="All Products"
            animateOn="view"
            revealDirection="left"
            encryptedClassName='decrypted'
            sequential={true}
            speed={70}
            className="decrypted"
          />
        </div>
        <div className="shop-product-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="shop-product-card">
              <Link to={`/product/${product.handle}`} className="shop-product-link">
                <div className="shop-product-image">
                  <img src={product.image1} alt={product.name} className="image-main" />
                  <img src={product.image2} alt={product.name} className="image-hover" />
                </div>
              </Link>
              <div className="shop-product-details">
                <h3>{product.name}</h3>
                <p className='product-price'>₹{product.price.toFixed(2)}</p>
                <button
                  className="add-to-cart-icon-btn"
                  onClick={() => handleAddToCart(product.variants[0].id)}
                  aria-label="Add to Cart"
                >
                  <AiOutlineShoppingCart className="icon" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Shop;
