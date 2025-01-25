import React, { useEffect, useState } from "react";
import "./CSS/WNavbar.css";
import { Link } from "react-router-dom";

export default function WNavbar(props) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollPos, setLastScrollPos] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [isCollectionHovered, setIsCollectionHovered] = useState(false);
  const [isShopHovered, setIsShopHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);  // New state to manage the menu

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

  function toggleMenu() {
    setMenuOpen(!menuOpen); // Toggle the menu open/close state
  }
  function closeMenu() {
    setMenuOpen(false);  // Close the menu
  }

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => setHovered(false);

  return (
    <>
      <button className="menu-toggle" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div className="wparent-nav">

        <nav
          className={`wsneakers-navbar ${isVisible ? "visible" : "hidden"} ${menuOpen ? "open" : ""}`} // Apply open class if menu is open
          style={{
            transition: "transform 0.4s ease, opacity 0.4s ease",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
             {/* <div className="menu-close-button" onClick={closeMenu}>X</div>  */}
          <img src="/wlogoblack.png" alt="Logo" className="wsneakers-logo" />
          <div className="wsneakers-navlink-container">
            <Link to="/blase-women" className="wsneakers-navlink-dif">
              HOME
            </Link>
            <Link to="/women/shop" className="wsneakers-navlink">
              DRESSES
            </Link>
            <Link to="/women/shop" className="wsneakers-navlink">
              CO-ORDS
            </Link>
            <Link to="/women/shop" className="wsneakers-navlink">
              TOPS
            </Link>
            <Link
              to="/women/shop"
              onClick={props.handleNavigation}
              className="wsneakers-navlink"
            >
              SHOP
            </Link>
            <Link
              to="/order"
              onClick={props.handleNavigation}
              className="wsneakers-navlink"
            >
              SKIRTS
            </Link>
          </div>
          <div className="wimg-box">
            {/* 
          <Link to="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={{ color: "white" }}
              width="24"
              height="24"
              fill="currentColor"
              className="bi bi-bag"
              viewBox="0 0 16 16"
            >
              <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
            </svg>
          </Link> */}
          </div>
        </nav>

        {/* <div className="wrapper">
        <div className="menu-container">
          <div className="hamburger">
            <img src="/logoWhite.png" alt="Menu" />
          </div>
          <div className="menu">
            <div className="menu-item">Romantcising '24</div>
            <div className="menu-item">Your Eyes Only</div>
            <div className="menu-item">Recommended</div>
            <div className="menu-item">Most Bought</div>
          </div>
        </div>
      </div> */}
      </div>
    </>
  );
}
