import React from "react";
import "./Collectioncomp.css";
import { Swiper, SwiperSlide } from "swiper/react";


import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

const TopCollection = () => {
  return (
    <div className="mcollectionComp-section">
  

      {/* Regular Layout for Desktop */}
      <div className="mcollectionComp-container desktop-layout">
        {/* Collection 1 */}
        <div className="mcollectionComp-card">
          <img
            src="/Products/shirt1.png"
            alt="ROMANTICISING 24'"
            className="mcollectionComp-image"
          />
          <div className="mcollectionComp-overlay">
            <h2 className="mcollectionComp-name">SHIRTS</h2>
            <p className="mcollectionComp-desc">
              A timeless collection embodying elegance and love.
            </p>
            <button className="mview-button">Check Out</button>
          </div>
        </div>

        {/* Collection 2 */}
        <div className="mcollectionComp-card">
          <img
            src="/Products/shirt2.png"
            alt="YOUR EYES ONLY"
            className="mcollectionComp-image"
          />
          <div className="mcollectionComp-overlay">
            <h2 className="mcollectionComp-name">T-SHIRTS</h2>
            <p className="mcollectionComp-desc">
              A bold statement crafted just for you.
            </p>
            <button className="mview-button">Take a Look</button>
          </div>
        </div>
      </div>

      {/* Slider Layout for Mobile */}
      <div className="mcollectionComp-container mobile-layout">
        <Swiper
          modules={[ Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          
          pagination={{ clickable: true }}
          className="mcollectionComp-slider"
        >
          {/* Slide 1 */}
          <SwiperSlide>
            <div className="mcollectionComp-card">
              <img
                src="/Products/shirt1.png"
                alt="ROMANTICISING 24'"
                className="mcollectionComp-image"
              />
              <div className="mcollectionComp-overlay">
                <h2 className="mcollectionComp-name">SHIRTS</h2>
                <p className="mcollectionComp-desc">
                  A timeless collection embodying elegance and love.
                </p>
                <button className="mview-button">Check Out</button>
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 2 */}
          <SwiperSlide>
            <div className="mcollectionComp-card">
              <img
                src="/Products/shirt2.png"
                alt="YOUR EYES ONLY"
                className="mcollectionComp-image"
              />
              <div className="mcollectionComp-overlay">
                <h2 className="mcollectionComp-name">T-SHIRTS</h2>
                <p className="mcollectionComp-desc">
                  A bold statement crafted just for you.
                </p>
                <button className="mview-button">Take a Look</button>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default TopCollection;
