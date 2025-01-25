import React, { useEffect, useState } from "react";
import "./CSS/Style.css";
import "./CSS/Navbar.css";
import { Link } from "react-router-dom";
import { AiOutlineShoppingCart, AiOutlineSearch } from "react-icons/ai";
import { RiAccountCircleLine } from "react-icons/ri";
import CartDrawer from './Shop/CartDrawer';

export default function Navbar(props) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollPos, setLastScrollPos] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [isCollectionHovered, setIsCollectionHovered] = useState(false);
  const [isShopHovered, setIsShopHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      // Show navbar when scrolling up, hide when scrolling down
      if (currentScrollPos > lastScrollPos) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollPos]);

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => setHovered(false);

  return (
    <>
      <div className="parent-nav">
        <nav
          className={`sneakers-navbar ${isVisible ? "visible" : "hidden"}`}
          style={{
            transition: "transform 0.4s ease, opacity 0.4s ease",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >

          <div className="img-box">
            <img src="/logobig.avif" alt="Logo" className="sneakers-logo" />
          </div>


          <div
            className="sneakers-navlink-container"
          >
            <Link to="/" className="sneakers-navlink-dif">
              HOME
            </Link>
            <div
              className="sneakers-navlink-collection-container"
              onMouseEnter={() => setIsCollectionHovered(true)}
              onMouseLeave={() => setIsCollectionHovered(false)}
            >
              <Link to="/" className="sneakers-navlink">COLLECTION</Link>
              {isCollectionHovered && (
                <div className="collection-hover-box">
                  <div className="collection-item">
                    <img src="/Products/1.png" alt="Romantiscing '24" />
                    <span className="collection-text">Romantiscing '24</span>
                  </div>
                  <div className="collection-item">
                    <img src="/Products/2.png" alt="Your Eyes Only" />
                    <span className="collection-text">Your Eyes Only</span>
                  </div>
                </div>
              )}
            </div>
            <div
              className="sneakers-navlink-collection-container"
              onMouseEnter={() => setIsShopHovered(true)}
              onMouseLeave={() => setIsShopHovered(false)}
            >
              <Link to="/order" onClick={props.handleNavigation} className="sneakers-navlink ">SHOP BY</Link>
              {isShopHovered && (
                <div className="shop-hover-box">
                  <div className="shop-item">

                    <span className="shop-text">SHIRTS</span>
                  </div>
                  <div className="shop-item">

                    <span className="shop-text">TSHIRTS</span>
                  </div>
                  <div className="shop-item">

                    <span className="shop-text">BOTTOMS</span>
                  </div>
                  <div className="shop-item">

                    <span className="shop-text">ESSENTIALS</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="img-box">

           
              <svg
                xmlns="http://www.w3.org/2000/svg"
                style={{ color: "white" }}
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-bag"
                viewBox="0 0 16 16"
                onClick={() => setIsCartOpen(true)}
              >
                <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
              </svg>
           
            <Link to="/login"> <RiAccountCircleLine className="text-3xl text-white" /></Link>
            <div className="menu-icon" onClick={toggleMenu}>

              <div className={`bar ${isMenuOpen ? "open" : ""}`}></div>
              <div className={`bar ${isMenuOpen ? "open" : ""}`}></div>
              <div className={`bar ${isMenuOpen ? "open" : ""}`}></div>
            </div>


          </div>
        </nav >
      </div >

      <div className={`menu ${isMenuOpen ? "show" : ""}`}>
        <button className="close-btn" onClick={closeMenu}>
          ×
        </button>
        <ul>

          <Link to="/" className="sneakers-navlink-dif">
            HOME
          </Link>
          <Link to="/order" className="sneakers-navlink-dif">
            SHOP
          </Link>
          <Link to="/order" className="sneakers-navlink-dif">
            COLLECTIONS
          </Link>
          <Link to="/order" className="sneakers-navlink-dif">
            BOTTOMS
          </Link>

        </ul>
      </div>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  );
}
