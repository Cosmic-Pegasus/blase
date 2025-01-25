import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom"; // For dynamic routing
import './Shop.css';
import { Breadcrumb } from "flowbite-react";
import Navbar from "../Navbar";
import { HiHome } from "react-icons/hi";
import Footer from '../Footer';
import { useCart } from "./CartContext";
import { AiOutlineSearch } from "react-icons/ai"
import { AiOutlineShoppingCart } from "react-icons/ai";
// import SplashCursor from '../../content/Animations/SplashCursor/SplashCursor'
import DecryptedText from '../../content/TextAnimations/DecryptedText/DecryptedText'

// const products = [
//   {
//     id: 1,
//     name: 'Sneakers Alpha',
//     price: 79.99,
//     image1: '/Products/insta (1).jpg',
//     image2: '/Products/insta (2).jpg',
//     link: '/product/ex1',
//   },
//   {
//     id: 2,
//     name: 'Urban Kicks',
//     price: 289.99,
//     image1: '/Products/insta (11).jpg',
//     image2: '/Products/insta (12).jpg',
//     link: '/product/urban-kicks',
//   },
//   {
//     id: 3,
//     name: 'Street Runner',
//     price: 399.99,
//     image1: '/Products/insta (3).jpg',
//     image2: '/Products/insta (4).jpg',
//     link: '/product/street-runner',
//   },
//   {
//     id: 4,
//     name: 'Retro Style',
//     price: 649.99,
//     image1: '/Products/insta (1).jpg',
//     image2: '/Products/insta (2).jpg',
//     link: '/product/retro-style',
//   },
//   {
//     id: 5,
//     name: 'Sneakers Alpha',
//     price: 795.99,
//     image1: '/Products/insta (1).jpg',
//     image2: '/Products/insta (2).jpg',
//     link: '/product/sneakers-alpha',
//   },
//   {
//     id: 6,
//     name: 'Urban Kicks',
//     price: 869.99,
//     image1: '/Products/insta (3).jpg',
//     image2: '/Products/insta (4).jpg',
//     link: '/product/urban-kicks',
//   },
//   {
//     id: 7,
//     name: 'Street Runner',
//     price: 5599.99,
//     image1: '/Products/insta (3).jpg',
//     image2: '/Products/insta (4).jpg',
//     link: '/product/street-runner',
//   },
//   {
//     id: 8,
//     name: 'Retro Style',
//     price: 6659.99,
//     image1: '/Products/insta (11).jpg',
//     image2: '/Products/insta (12).jpg',
//     link: '/product/retro-style',
//   },
//   // Add more products as needed
// ];

export default function Shop(props) {
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('asc');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  // const { cart, addToCart } = useCart();


  const { addToCart } = useCart();


  const handleSort = (e) => setSort(e.target.value);
  const handleSearch = (e) => setSearch(e.target.value.toLowerCase());

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setSelectedSize('');
    setQuantity(1);
  };

  const addProductToCart = () => {
    if (!selectedProduct) {
      alert("No product selected!");
      return;
    }

    if (!selectedSize) {
      alert("Please select a size!");
      return;
    }

    setCart((prevCart) => {
      const existingProduct = prevCart.find(
        (item) => item.id === selectedProduct.id && item.size === selectedSize
      );

      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === selectedProduct.id && item.size === selectedSize
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...prevCart,
        {
          ...selectedProduct,
          size: selectedSize,
          quantity,
        },
      ];
    });

    closeModal();
  };

  const handleAddToCart = () => {
    if (!selectedProduct) {
      alert("No product selected!");
      return;
    }
    if (!selectedSize) {
      alert("Please select a size!");
      return;
    }

    addToCart(selectedProduct, selectedSize, quantity);
    closeModal();
  };


  const toggleCart = () => setIsCartOpen((prevState) => !prevState);

  const filteredProducts = props.products
    .filter((product) => product.name.toLowerCase().includes(search))
    .sort((a, b) => (sort === 'asc' ? a.price - b.price : b.price - a.price));

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <>
      <Navbar />

      <div className="shop-container">
        <div className="shop-header flex-wrap">
          <div className="flex items-center ">
            <div className="search-input-wrapper ">
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
              <span className="cart-text">Cart ({cart.length})</span>
            </button>
          </div>
        </div>
        <Breadcrumb aria-label="Default breadcrumb example" className=" w-full breadcrumbs">
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
              <Link to={`/product/${product.id}`} className="shop-product-link">
                <div className="shop-product-image">
                  <img src={product.image1} alt={product.name} className="image-main" />
                  <img src={product.image2} alt={product.name} className="image-hover" />
                </div>
              </Link>
              <div className="shop-product-details">
                <div>
                  <h3>{product.name}</h3>
                  <p className='product-price'>${product.price.toFixed(2)}</p>
                </div>
                {/* <button
                  className="add-to-cart-btn"
                  onClick={() => openModal(product)}
                >
                  Add to Cart
                </button> */}
                <button
                  className="add-to-cart-icon-btn"
                  onClick={() => openModal(product)}
                  aria-label="Add to Cart"
                >
                  <AiOutlineShoppingCart className="icon" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Overlay */}
      <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-content">
          <h2>Your Cart</h2>
          <button className="cart-close-btn" onClick={toggleCart}>
            ✖
          </button>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              <ul className="cart-items">
                {cart.map((item) => (
                  <li key={`${item.id}-${item.size}`} className="cart-item">
                    <img src={item.image1} alt={item.name} className="cart-item-image" />
                    <div className="cart-item-details">
                      <h4>{item.name}</h4>
                      <p>Size: {item.size}</p>
                      <p>${item.price.toFixed(2)}</p>
                      <div className="quantity-changer">
                        <button
                          className="quantity-btn"
                          onClick={() =>
                            updateQuantity(item.id, item.size, item.quantity - 1)
                          }
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className="quantity-btn"
                          onClick={() =>
                            updateQuantity(item.id, item.size, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      className="cart-remove-btn"
                      onClick={() => removeFromCart(item.id, item.size)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <div className="cart-total">
                <h3>Total: ${cartTotal.toFixed(2)}</h3>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className='child1'>
              <h2>{selectedProduct.name}</h2>
              <img src={selectedProduct.image1} alt={selectedProduct.name} />
            </div>
            <div className='child1'>
              <p className='modal-price'>${selectedProduct.price.toFixed(2)}</p>
              <label>
                Size:
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                >
                  <option value="">Select Size</option>
                  <option value="S">Small</option>
                  <option value="M">Medium</option>
                  <option value="L">Large</option>
                  <option value="XL">Extra Large</option>
                </select>
              </label>
              <label>
                Quantity:
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                />
              </label>
              <button className="modal-add-to-cart" onClick={handleAddToCart}>
                Add to Cart
              </button>
              <button className="modal-close-btn" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

