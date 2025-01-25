import React, { useState, useEffect } from "react";
import "../CSS/WProductPage.css";
import { useParams, useNavigate } from "react-router-dom";
import { Breadcrumb } from "flowbite-react";
import WNavbar from "../WNavbar";
import { HiHome } from "react-icons/hi";
import Suggested from "../../Shop/Suggested";
import { FaPlus, FaMinus } from "react-icons/fa"; // For quantity icons
import { AiOutlineDown } from "react-icons/ai"; // For size guide dropdown
import AddToCartWithHoverCrosshair from "../../Shop/AddToCartWithCrosshair";
import WFooter from "../WFooter";
import WSuggested from "./WSuggested";

export const products = [
    {
        id: 1,
        name: "Sneakers Alpha",
        description: "Elevate your style with Sneakers Alpha. Designed for ultimate comfort and trendsetting looks. Perfect for every occasion.",
        extraContent: [
            "Smooth textured polyester",
            "Pleated detailing",
            "Loose tailored fit (True to size)",
            "Comes in 2 length options - Regular/ Tall",
            "Custom sizing also available. Contact us on IG for the same",
        ],
        price: 79.99,
        images: [
            "/Products/women/w (1).jpg",
            "/Products/women/w (2).jpg",
            "/Products/women/w (3).jpg",
            "/Products/women/w (5).jpg",
            "/Products/women/w (4).jpg",
        ],
        colors: [
            { name: "Blue", image: "/Products/women/w (12).jpg",},
            { name: "Red", image:  "/Products/women/w (13).jpg", },
            { name: "Black", image:  "/Products/women/w (14).jpg", },
        ],
        sizes: ["S", "L", "XL", "XXL", "XXXL"],
    },
    {
        id: 2,
        name: "Product 2",
        description: "Elevate your style with Sneakers Alpha. Designed for ultimate comfort and trendsetting looks. Perfect for every occasion.",
        extraContent: [
            "Smooth textured polyester",
            "Pleated detailing",
            "Loose tailored fit (True to size)",
            "Comes in 2 length options - Regular/ Tall",
            "Custom sizing also available. Contact us on IG for the same",
        ],
        price: 79.99,
        images: [
            "/Products/women/w (1).jpg",
            "/Products/women/w (2).jpg",
            "/Products/women/w (3).jpg",
            "/Products/women/w (5).jpg",
            "/Products/women/w (4).jpg",
        ],
        colors: [
            { name: "Blue", image: "/Products/women/w (17).jpg",},
            { name: "Red", image:  "/Products/women/w (16).jpg", },
            { name: "Black", image:  "/Products/women/w (15).jpg", },
        ],
        sizes: ["S", "L", "XL", "XXL", "XXXL"],
    }
];

const WProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const product = products.find((p) => p.id === parseInt(id, 10));

    useEffect(() => {
        if (!product) {
            console.error("Product not found or ID is invalid");
            navigate("/order", { replace: true });
        }
    }, [product, navigate]);

    const [selectedImage, setSelectedImage] = useState(product?.images[0] || "");
    const [selectedColor, setSelectedColor] = useState(product?.colors[0] || null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [showFullImage, setShowFullImage] = useState(false);
    const [showExtraContent, setShowExtraContent] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [showSizeGuide, setShowSizeGuide] = useState(false);

    const handleQuantityChange = (increment) => {
        setQuantity((prev) => Math.max(1, prev + increment));
    };


    return (
        <>
            <WNavbar />

            <div className="wfinal-product-page">
                {/* <Breadcrumb aria-label="Default breadcrumb example" className="my-6 w-full wbreadcrumbs">
                    <Breadcrumb.Item href="/" icon={HiHome}>
                        Home
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="/order">Shop</Breadcrumb.Item>
                    <Breadcrumb.Item>{product?.name || "Loading..."}</Breadcrumb.Item>
                </Breadcrumb> */}

                {product ? (
                    <div className="wcontent">
                        <div className="wgallery-section">
                            <div className="wproduct-image-grid">
                                {product.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Product Image ${index + 1}`}
                                        className="wchild-grid-image"
                                        tabIndex="0"
                                        role="button"
                                        aria-label={`Open image ${index + 1}`}
                                        onClick={() => {
                                            setSelectedImage(image);
                                            setShowFullImage(true);
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {showFullImage && (
                            <div
                                className="fullscreen-view"
                                tabIndex="0"
                                role="dialog"
                                aria-label="Fullscreen Image View"
                                onClick={() => setShowFullImage(false)}
                            >
                                <img src={selectedImage} alt="Fullscreen View" className="fullscreen-image" />
                            </div>
                        )}

                        <div className="winfo-section">
                            <h1 className="wfinal-product-name">{product.name}</h1>

                            <p className="wfinal-product-price">${product.price.toFixed(2)}</p>

                            <div className="wcolor-options">
                                <h3>Select Color:</h3>
                                <div className="wcolor-thumbnails">
                                    {product.colors.map((color, index) => (
                                        <div
                                            key={index}
                                            className={`wcolor-thumbnail ${selectedColor?.name === color.name ? "selected" : ""}`}
                                            tabIndex="0"
                                            role="button"
                                            aria-label={`Select color ${color.name}`}
                                            onClick={() => setSelectedColor(color)}
                                        >
                                            <img src={color.image} alt={color.name} className="wcolor-image" />
                                           
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="wquantity-selector">
                                <h3>Quantity:</h3>
                                <div className="wquantity-box">
                                    <button onClick={() => handleQuantityChange(-1)} className="wquantity-btn">
                                        -
                                    </button>
                                    <span className="wquantity-value">{quantity}</span>
                                    <button onClick={() => handleQuantityChange(1)} className="wquantity-btn">
                                        +
                                    </button>
                                </div>
                            </div>
                            <div className="wsize-options">
                                <h3>Select Size:</h3>
                                <div className="wsize-boxes">
                                    {product.sizes.map((size, index) => (
                                        <div
                                            key={index}
                                            className={`wsize-box ${selectedSize === size ? "selected" : ""}`}
                                            tabIndex="0"
                                            role="button"
                                            aria-label={`Select size ${size}`}
                                            onClick={() => setSelectedSize(size)}
                                        >
                                            {size}
                                        </div>
                                    ))}
                                </div>

                            </div>
                            {/* Quantity Selector */}
                     

                            {/* <button onClick={handleAddToCart} className="final-add-to-cart-btn" aria-label="Add to cart">
                                <ShinyText text="ADD TO CART" disabled={false} speed={3} className='custom-class' />
                            </button> */}
                            <AddToCartWithHoverCrosshair onAddToCart={handleAddToCart} />

                            <div className="wcollapsible-section">
                                <button
                                    className={`wcollapsible-button ${showExtraContent ? "active" : ""}`}
                                    tabIndex="0"
                                    role="button"
                                    aria-expanded={showExtraContent}
                                    aria-label="Toggle product details"
                                    onClick={() => setShowExtraContent(!showExtraContent)}
                                >
                                    {showExtraContent ? "Hide Details" : "Product Details"}
                                    <span className="icon">{showExtraContent ? "-" : "+"}</span>
                                </button>
                                <div
                                    className={`wcollapsible-content ${showExtraContent ? "expanded" : ""}`}
                                    aria-hidden={!showExtraContent}
                                >
                                    <ul>
                                        {product.extraContent.map((detail, index) => (
                                            <li key={index}>{detail}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <button
                                className="wcollapsible-button mt-5 py-12"
                                onClick={() => setShowSizeGuide((prev) => !prev)}
                            >
                                Size Guide <AiOutlineDown className="wsize-guide-icon" />
                            </button>
                            {showSizeGuide && (
                                <div className="wsize-guide-content">
                                    <ul>
                                        <li><strong>S:</strong> Chest 34"-36", Waist 28"-30"</li>
                                        <li><strong>L:</strong> Chest 38"-40", Waist 32"-34"</li>
                                        <li><strong>XL:</strong> Chest 42"-44", Waist 36"-38"</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <p>Loading product details...</p>
                )}
            </div>

            <WSuggested />
            <WFooter />
        </>
    );
};

export default WProductPage;

