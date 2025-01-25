import { useRef, useState } from "react";
import Crosshair from "../../content/Animations/Crosshair/Crosshair"; // Import the Crosshair animation
import ShinyText from "../../content/TextAnimations/ShinyText/ShinyText"; // Import your ShinyText component

const AddToCartWithHoverCrosshair = ({ onAddToCart, disabled, isLoading }) => {
  const buttonRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => !disabled && !isLoading && setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleClick = async (e) => {
    e.preventDefault();
    if (!disabled && !isLoading) {
      await onAddToCart();
    }
  };

  const getButtonText = () => {
    if (isLoading) return "ADDING TO CART...";
    if (disabled) return "SELECT SIZE FIRST";
    return "ADD TO CART";
  };

  return (
    <div
      ref={buttonRef}
      style={{
        position: "relative",
        overflow: "hidden",
        display: "inline-block",
        borderRadius: "8px",
        width: "100%",
        opacity: disabled || isLoading ? 0.6 : 1,
        cursor: disabled || isLoading ? "not-allowed" : "pointer"
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isHovered && <Crosshair containerRef={buttonRef} color="#ffffff" />} {/* Animation on hover */}
      <button
        onClick={handleClick}
        className={`final-add-to-cart-btn ${isLoading ? 'animate-pulse' : ''}`}
        aria-label="Add to cart"
        disabled={disabled || isLoading}
        style={{
          zIndex: 1,
          position: "relative",
          width: "100%",
          border: "none",
          borderRadius: "8px",
        }}
      >
        <ShinyText
          text={getButtonText()}
          disabled={disabled || isLoading}
          speed={3}
          className="custom-class"
        />
      </button>
    </div>
  );
};

export default AddToCartWithHoverCrosshair;
