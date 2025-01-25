import React from 'react';
import './CSS/Section.css'; // Import the CSS file

const WSection = () => {
  return (
    <section className="design-philosophy">
      {/* Section Header */}
      <div className="header">
        <h1 className="title">
          Design <em>philosophy</em>
        </h1>
        <a href="#" className="learn-more">
          Learn More ↗
        </a>
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        {/* Left Card - Small */}
        <div className="card">
          <img
            src="/Products/women/w (13).jpg" // Replace with the actual image path or URL
            alt="Small Production"
            className="card-image"
          />
          <div className="card-content">
            <h3 className="card-title">SMALL</h3>
            <p className="card-description">
              Through our small batch production, we find the equilibrium between supply and demand, and aim for
              timeless designs. By keeping a low, minimal inventory, we make sure that new releases feel necessary,
              not excessive, creating wearable pieces designed to last.
            </p>
          </div>
        </div>

        {/* Right Card - Seasonless + Slow */}
        <div className="card" id='cardRight'>
          <img
            src="/Products/women/w (12).jpg" // Replace with the actual image path or URL
            alt="Seasonless + Slow"
            className="card-image"

        
          />
          <div className="card-content">
            <h3 className="card-title">SEASONLESS + SLOW</h3>
            <p className="card-description">
              The conventional, trend-driven fashion model equates the mindset of constant production of new styles.
              We stay away from that. Instead of “fast fashion,” we create seasonless collections of considered,
              thoughtfully designed pieces, made to be worn for years. This includes uncompromising fabric and color
              selections, producing deliberate choices, and a love for clothing that transforms.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bottom-section">
        <img
          src="/Products/women/shirt2.jpg" // Replace with the actual image path or URL
          alt="Our first showroom in Bali"
          className="bottom-image"
        />
        <div className="bottom-content">
          <h2>
            Our first <em>showroom in Bali</em>
          </h2>
          <p>
            BALI ETHIC SHOWROOM is a celebration of slow, considered design. It's a place you can experience
            sustainability in action, to not only feel your clothing’s quality but see how it is brought to life.
          </p>
          <div className="subscription">
            <input
              type="email"
              placeholder="EMAIL"
              className="email-input"
            />
            <button className="subscribe-button">Subscribe</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WSection;
