import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/Switcher.css";
import blaseLogo from "/logoBigdark.png"; // Replace with your Blase logo path
import blaseWomenLogo from "/wlogoblack.png"; // Replace with your Blase Women logo path

const SwitcherBar = () => {
  const [isBlase, setIsBlase] = useState(true);
  const navigate = useNavigate();

  const toggleOption = () => {
    setIsBlase((prev) => {
      const newState = !prev;
      navigate(newState ? "/" : "/blase-women");
      return newState;
    });
  };

  return (
    <div className="toggle-container">
      <div
        className={`toggle-switch ${isBlase ? "active-blase" : "active-women"}`}
        onClick={toggleOption}
      >
        <div className="toggle-option blase">
          <img src={blaseLogo} alt="Blase Logo" className="logo" />
         
        </div>
        <div className="toggle-option women">
          <img src={blaseWomenLogo} alt="Blase Women Logo" className="logo" />
          
        </div>
        <div className="toggle-slider" />
      </div>
    </div>
  );
};

export default SwitcherBar;
