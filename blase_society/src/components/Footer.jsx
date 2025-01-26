import React from "react";
import Marquee from "react-fast-marquee";
import "./CSS/Footer.css";
//import HyperSpeed from '../content/Backgrounds/Hyperspeed/Hyperspeed'


export default function Footer() {
  return (
    <footer className="custom-footer">
      {/* Logo Section */}
      <div className="footer-logo-container">
        <img src="/logobig.avif" alt="Brand Logo" className="footer-logo" />
      </div>

      {/* Image Marquee */}
      <div className="marquee-container">
        <Marquee pauseOnHover={true} speed={50} gradient={false} className="marquee">
          {[1, 2, 3, 4].map((num) => (
            <img 
              key={num} 
              src={`/Products/${num}.webp`} 
              alt={`Product ${num}`} 
              className="footer-image" 
            />
          ))}
        </Marquee>
      </div>

      {/* Main Footer Content */}
      <div className="footer-content">
        {/* Newsletter Section */}
        <div className="newsletter-section">
          <h2>Get 10% Off Your First Order</h2>
          <p>Join our community for exclusive deals and early access to new collections.</p>
          <div className="newsletter-input">
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
        </div>

        {/* Links Section */}
        <div className="footer-links">
          <div className="footer-links-column">
            <h3>Support</h3>
            <ul>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/returns">Returns & Exchanges</a></li>
              <li><a href="/shipping">Shipping Information</a></li>
            </ul>
          </div>
          
          <div className="footer-links-column">
            <h3>Legal</h3>
            <ul>
              <li><a href="/terms">Terms of Service</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/cookies">Cookie Settings</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="social-links">
        <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
          <i className="fab fa-instagram"></i>
        </a>
        <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
          <i className="fab fa-facebook"></i>
        </a>
        <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
          <i className="fab fa-youtube"></i>
        </a>
      </div>

      {/* Copyright */}
      <div className="footer-copyright">
        <p>&copy; {new Date().getFullYear()} Your Brand. All rights reserved.</p>
      </div>
      {/* <HyperSpeed/> */}
    </footer>
  );
}
