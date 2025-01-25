import React from "react";
import "./CSS/CollectionSection.css";

const CollectionSection = () => {
  return (
    <div className="collection-section">
      <h1 className="collection-title">Explore Our Collections</h1>
      <div className="collection-container">
        {/* Collection 1 */}
        <div className="collection-card">
          <img
             src="/Products/cat2.webp"
            alt="ROMANTICISING 24'"
            className="collection-image"
          />
          <div className="collection-overlay">
            <h2 className="collection-name">ROMANTICISING 24'</h2>
            <p className="collection-desc">
              A timeless collection embodying elegance and love.
            </p>
            <button className="view-button">Explore Now</button>
          </div>
        </div>

        {/* Collection 2 */}
        <div className="collection-card">
          <img
             src="/Products/insta (15).jpg"
            alt="YOUR EYES ONLY"
            className="collection-image"
          />
          <div className="collection-overlay">
            <h2 className="collection-name">YOUR EYES ONLY</h2>
            <p className="collection-desc">
              A bold statement crafted just for you.
            </p>
            <button className="view-button">Discover More</button>
          </div>
        </div>
        <div className="collection-card">
          <img
            src="/Products/insta (4).jpg"
            alt="YOUR EYES ONLY"
            className="collection-image"
          />
          <div className="collection-overlay">
            <h2 className="collection-name">YOUR EYES ONLY</h2>
            <p className="collection-desc">
              A bold statement crafted just for you.
            </p>
            <button className="view-button">Discover More</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionSection;
