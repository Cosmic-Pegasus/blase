import React, { useState, useEffect } from "react";
import "../CSS/ProductPage.css";
import Slider from "../Slider";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "../Footer";
import { Breadcrumb } from "flowbite-react";
import Navbar from "../Navbar";
import { useCart } from "./CartContext";
import { HiHome } from "react-icons/hi";
import Suggested from "./Suggested";
import GradientText from '../../content/TextAnimations/GradientText/GradientText'
import ShinyText from '../../content/TextAnimations/ShinyText/ShinyText'
import { FaPlus, FaMinus } from "react-icons/fa"; // For quantity icons
import { AiOutlineDown } from "react-icons/ai"; // For size guide dropdown
import AddToCartWithHoverCrosshair from "./AddToCartWithCrosshair";

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
            "/Products/insta (1).jpg",
            "/Products/insta (2).jpg",
            "/Products/insta (3).jpg",
            "/Products/insta (5).jpg",
            "/Products/insta (4).jpg",
        ],
        colors: [
            { name: "Blue", image: "/Products/insta (12).jpg" },
            { name: "Red", image: "/Products/insta (13).jpg" },
            { name: "Black", image: "/Products/insta (14).jpg" },
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
            "/Products/insta (1).jpg",
            "/Products/insta (2).jpg",
            "/Products/insta (3).jpg",
            "/Products/insta (5).jpg",
            "/Products/insta (4).jpg",
        ],
        colors: [
            { name: "Blue", image: "/Products/insta (12).jpg" },
            { name: "Red", image: "/Products/insta (13).jpg" },
            { name: "Black", image: "/Products/insta (14).jpg" },
        ],
        sizes: ["S", "L", "XL", "XXL", "XXXL"],
    }
];

const ProductPage = () => {
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

    const { addToCart } = useCart();
    const handleAddToCart = () => {
        if (!selectedSize) {
            alert("Please select a size!");
            return;
        }
        if (!product) {
            alert("Product is not available");
            return;
        }
        try {
            addToCart(product, selectedSize, 1); // Adding one item
        } catch (error) {
            console.error(error);
            alert("Error adding to cart. Please try again.");
        }
    };

    return (
        <>
            <Navbar />

            <div className="final-product-page">
                <Breadcrumb aria-label="Default breadcrumb example" className="my-6 w-full breadcrumbs">
                    <Breadcrumb.Item href="/" icon={HiHome}>
                        Home
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="/order">Shop</Breadcrumb.Item>
                    <Breadcrumb.Item>{product?.name || "Loading..."}</Breadcrumb.Item>
                </Breadcrumb>

                {product ? (
                    <div className="content">
                        <div className="gallery-section">
                            <div className="product-image-grid">
                                {product.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Product Image ${index + 1}`}
                                        className="child-grid-image"
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

                        <div className="info-section">
                            <h1 className="final-product-name">{product.name}</h1>

                            <p className="final-product-price">${product.price.toFixed(2)}</p>

                            <div className="color-options">
                                <h3>Select Color:</h3>
                                <div className="color-thumbnails">
                                    {product.colors.map((color, index) => (
                                        <div
                                            key={index}
                                            className={`color-thumbnail ${selectedColor?.name === color.name ? "selected" : ""}`}
                                            tabIndex="0"
                                            role="button"
                                            aria-label={`Select color ${color.name}`}
                                            onClick={() => setSelectedColor(color)}
                                        >
                                            <img src={color.image} alt={color.name} className="color-image" />

                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="quantity-selector">
                                <h3>Quantity:</h3>
                                <div className="quantity-box">
                                    <button onClick={() => handleQuantityChange(-1)} className="quantity-btn">
                                        -
                                    </button>
                                    <span className="quantity-value">{quantity}</span>
                                    <button onClick={() => handleQuantityChange(1)} className="quantity-btn">
                                        +
                                    </button>
                                </div>
                            </div>
                            <div className="size-options">
                                <h3>Select Size:</h3>
                                <div className="size-boxes">
                                    {product.sizes.map((size, index) => (
                                        <div
                                            key={index}
                                            className={`size-box ${selectedSize === size ? "selected" : ""}`}
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

                            <div className="collapsible-section">
                                <button
                                    className={`collapsible-button ${showExtraContent ? "active" : ""}`}
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
                                    className={`collapsible-content ${showExtraContent ? "expanded" : ""}`}
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
                                className="collapsible-button mt-5 py-12"
                                onClick={() => setShowSizeGuide((prev) => !prev)}
                            >
                                Size Guide <AiOutlineDown className="size-guide-icon" />
                            </button>
                            {showSizeGuide && (
                                <div className="size-guide-content">
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

            <Suggested />
            <Footer />
        </>
    );
};

export default ProductPage;

