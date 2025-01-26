import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './CSS/WShop.css';
import WNavbar from "./WNavbar";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import DecryptedText from '../../content/TextAnimations/DecryptedText/DecryptedText';
import { AiOutlineSearch } from "react-icons/ai";

const WShop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // ... fetchProducts useEffect remains the same ...

  // Add filter functionality
  useEffect(() => {
    let result = [...products];

    if (search) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [products, search, sortBy]);

  return (
    <>
      <WNavbar />
      <div className="wshop-container">
        <div className="wshop-header">
          <div className="wbreadcrumbs">
            <span>Home / Women's Shop</span>
          </div>
          <h1 className="wshop-title">
            <span className="wdecrypted">
              <DecryptedText text="WOMEN'S COLLECTION" />
            </span>
          </h1>
          <div className="wsearch-input-wrapper">
            <AiOutlineSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="wshop-search"
            />
          </div>
        </div>

        <div className="wshop-controls">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="wshop-sort"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        <div className="wshop-product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <Link 
                to={`/women/product/${product.handle}`}
                className="wshop-product-card"
                key={product.id}
              >
                <div className="wshop-product-image">
                  <img src={product.image1} alt={product.name} />
                  <img src={product.image2 || product.image1} alt={product.name} className="wimage-hover" />
                </div>
                
                <div className="wshop-product-details">
                  <h3>{product.name}</h3>
                  <p className="wproduct-price">₹{product.price.toFixed(2)}</p>
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