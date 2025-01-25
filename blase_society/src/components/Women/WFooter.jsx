import React from "react";
import "./CSS/Footer.css";

export default function WFooter() {
  return (
    <footer className="wcustom-footer">
      {/* Header Section */}
      <div className="section2-header">
        <h1 className="section2-title">
          Follow <em>our Instagram</em>
        </h1>
        <a href="#" className="catalog-link2">
          Follow Now ↗
        </a>
      </div>

      {/* Image Grid */}
      <div className="wfooter-grid">
        <img src="/Products/women/w (5).jpg" alt="Product 1" className="footer-grid-image" />
        <img src="/Products/women/w (2).jpg" alt="Product 2" className="footer-grid-image" />
        <img src="/Products/women/w (3).jpg" alt="Product 3" className="footer-grid-image" />
        <img src="/Products/women/w (4).jpg" alt="Product 4" className="footer-grid-image" />
      </div>

      {/* Footer Content */}
      <div className="wfooter-content">
        {/* Logo */}
        <img src="/wlogoblack.png" alt="Logo" className="footer-logo" />

        {/* Support Links */}
        <div className="wsupport">
          <h3>Customer Support</h3>
          <ul>
            <li><a href="/shipping">Shipping Details</a></li>
            <li><a href="/returns">Returns & Exchanges</a></li>
            <li><a href="/terms">Refund Policy</a></li>
          </ul>
        </div>
        <div className="wsupport">
          <h3>Contact Us</h3>
          <ul>
            <li><a href="/retailer">Contact Now</a></li>
            <li><a href="/partnership">Partnership Requests</a></li>
            <li><a href="/terms">Terms of Use / Privacy / Cookie Settings</a></li>
          </ul>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="wsocial-links">
        <a href="https://instagram.com" target="_blank" rel="noreferrer">
          <i className="fab fa-instagram"></i>
        </a>
        <a href="https://tiktok.com" target="_blank" rel="noreferrer">
          <i className="fab fa-tiktok"></i>
        </a>
        <a href="https://youtube.com" target="_blank" rel="noreferrer">
          <i className="fab fa-youtube"></i>
        </a>
      </div>
    </footer>
  );
}
