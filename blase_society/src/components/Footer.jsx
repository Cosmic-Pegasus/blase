import React from "react";
import Marquee from "react-fast-marquee";
import "./CSS/Footer.css";
//import HyperSpeed from '../content/Backgrounds/Hyperspeed/Hyperspeed'


export default function Footer() {
  return (
    <footer className="custom-footer">
      {/* Image Slideshow */}
      <div className="img-box mb-10">
        <img src="/logobig.avif" alt="" className="sneakers-logo" />
      </div>
      <Marquee pauseOnHover={true} speed={50} gradient={false} className="marquee">
        <img src="/Products/1.webp" alt="Store 1" className="footer-image" />
        <img src="/Products/2.webp" alt="Store 2" className="footer-image" />
        <img src="/Products/3.webp" alt="Store 3" className="footer-image" />
        <img src="/Products/4.webp" alt="Store 4" className="footer-image" />
        <img src="/Products/1h.webp" alt="Store 4" className="footer-image" />
        <img src="/Products/2h.webp" alt="Store 5" className="footer-image" />
        <img src="/Products/3h.webp" alt="Store 5" className="footer-image" />
        <img src="/Products/4h.webp" alt="Store 5" className="footer-image" />
        <img src="/Products/4h.webp" alt="Store 5" className="footer-image" />
      </Marquee>

      {/* Newsletter and Support Section */}
      <div className="footer-content">
        {/* Newsletter */}
        <div className="newsletter">
          <h2>Exclusive 10% Discount for newsletter subscribers.</h2>
          <p>Early access to new collections, community-only promotions, and more.</p>
          <div className="newsletter-input">
            <input type="email" placeholder="Email" />
            <button>GET 10%</button>
          </div>
        </div>

        {/* Support & More */}
        <div className="flex justify-center gap-20">
          <div className="support">
            <h3></h3>
            <ul>
            
              <li><a href="/shipping">Contact</a></li>
              <li><a href="/returns">Returns & Exchanges</a></li>

            </ul>
          </div>
          <div className="support">
            <h3></h3>
            <ul>
              <li><a href="/shipping">Shipping Details</a></li>     
              <li><a href="/terms">Terms of Use / Privacy / Cookie Settings</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Social Icons */}
      <div className="social-links">
        <a href="https://instagram.com" target="_blank" rel="noreferrer">
          <i className="fab fa-instagram"></i>
        </a>
        <a href="https://tiktok.com" target="_blank" rel="noreferrer">
          <i className="fab fa-facebook"></i>
        </a>
        <a href="https://youtube.com" target="_blank" rel="noreferrer">
          <i className="fab fa-youtube"></i>
        </a>
      </div>
      {/* <HyperSpeed/> */}
    </footer>
  );
}
