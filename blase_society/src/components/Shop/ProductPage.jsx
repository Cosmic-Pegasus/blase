import React, { useState, useEffect } from "react";
import axios from "axios";
import "../CSS/ProductPage.css";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "../Footer";
import Navbar from "../Navbar";
import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import Suggested from "./Suggested";
import AddToCartWithHoverCrosshair from "./AddToCartWithCrosshair";
import { useMutation } from "@apollo/client";
import { ADD_TO_CART } from "./Cart";
import { CREATE_CART } from "./Cart";
import { FaPlus, FaMinus } from "react-icons/fa";
import { AiOutlineDown } from "react-icons/ai";

const ProductPage = () => {
    const { handle } = useParams();
    const navigate = useNavigate();
    const [addToCart] = useMutation(ADD_TO_CART);
    const [createCartMutation] = useMutation(CREATE_CART);

    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [selectedSize, setSelectedSize] = useState(null);
    const [showFullImage, setShowFullImage] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [cartId, setCartId] = useState(null);
    const [showExtraContent, setShowExtraContent] = useState(false);
    const [showSizeGuide, setShowSizeGuide] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const SHOPIFY_API_URL = "https://2499d0-e9.myshopify.com/api/2023-01/graphql.json";
    const SHOPIFY_ACCESS_TOKEN = "352164320ac49e869c945f919a199a85";

    useEffect(() => {
        const fetchProductByHandle = async () => {
            try {
                const query = `
                    query getProduct($handle: String!) {
                        productByHandle(handle: $handle) {
                            title
                            description
                            variants(first: 10) {
                                edges {
                                    node {
                                        id
                                        title
                                        price {
                                            amount
                                        }
                                        selectedOptions {
                                            name
                                            value
                                        }
                                    }
                                }
                            }
                            images(first: 5) {
                                edges {
                                    node {
                                        originalSrc
                                        altText
                                    }
                                }
                            }
                        }
                    }
                `;

                const response = await axios.post(
                    SHOPIFY_API_URL,
                    {
                        query,
                        variables: { handle },
                    },
                    {
                        headers: {
                            "X-Shopify-Storefront-Access-Token": SHOPIFY_ACCESS_TOKEN,
                            "Content-Type": "application/json",
                        },
                    }
                );

                const data = response.data.data.productByHandle;

                if (!data) {
                    throw new Error("Product not found");
                }

                setProduct({
                    title: data.title,
                    description: data.description,
                    images: data.images.edges.map((edge) => ({
                        src: edge.node.originalSrc,
                        alt: edge.node.altText || "",
                    })),
                    variants: data.variants.edges.map((edge) => ({
                        id: edge.node.id,
                        title: edge.node.title,
                        price: parseFloat(edge.node.price.amount).toFixed(2),
                        size: edge.node.selectedOptions.find(
                            (option) => option.name.toLowerCase() === "size"
                        )?.value || "N/A",
                    })),
                });

                setSelectedImage(data.images.edges[0]?.node.originalSrc || "");
                setLoading(false);
            } catch (error) {
                console.error(error);
                navigate("/order", { replace: true });
            }
        };

        fetchProductByHandle();
    }, [handle, navigate]);

    useEffect(() => {
        const existingCartId = localStorage.getItem("cartId");
        if (existingCartId) {
            setCartId(existingCartId);
        } else {
            createCart().then((id) => {
                localStorage.setItem("cartId", id);
                setCartId(id);
            });
        }
    }, []);

    const createCart = async () => {
        try {
            const { data } = await createCartMutation({
                variables: {
                    input: {
                        lines: [],
                    },
                },
            });
            return data.cartCreate.cart.id;
        } catch (error) {
            console.error("Error creating cart:", error);
            throw error;
        }
    };

    const handleAddToCart = async (quantity) => {
        if (!selectedSize) {
            alert("Please select a size.");
            return;
        }

        const selectedVariant = product.variants.find(variant => variant.id === selectedSize);

        if (!selectedVariant) {
            alert("Selected variant not found.");
            return;
        }

        if (!cartId) {
            console.error("Cart ID not found. Please try again.");
            return;
        }

        setIsLoading(true);

        try {
            const { data } = await addToCart({
                variables: {
                    cartId: cartId,
                    lines: [
                        {
                            merchandiseId: selectedVariant.id,
                            quantity: quantity,
                        },
                    ],
                },
            });
            console.log("Item added to cart:", data.cartLinesAdd.cart);
        } catch (error) {
            console.error("Failed to add product to cart:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuantityChange = (increment) => {
        setQuantity(prev => Math.max(1, prev + increment));
    };

    return (
        <>
            <Navbar />
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="final-product-page">
                    <Breadcrumb aria-label="Default breadcrumb example" className="my-6 w-full breadcrumbs">
                        <Breadcrumb.Item href="/" icon={HiHome}>
                            Home
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href="/order">Shop</Breadcrumb.Item>
                        <Breadcrumb.Item>{product?.title || "Loading..."}</Breadcrumb.Item>
                    </Breadcrumb>

                    <div className="content">
                        <div className="gallery-section">
                            <div className="product-image-grid">
                                {product.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image.src}
                                        alt={image.alt || `Product Image ${index + 1}`}
                                        className="grid-image"
                                        onClick={() => {
                                            setSelectedImage(image.src);
                                            setShowFullImage(true);
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {showFullImage && (
                            <div className="fullscreen-view" onClick={() => setShowFullImage(false)}>
                                <img src={selectedImage} alt="Fullscreen View" className="fullscreen-image" />
                            </div>
                        )}

                        <div className="info-section">
                            <h1 className="final-product-name">{product.title}</h1>
                            <p className="final-product-price">₹{product.variants[0]?.price}</p>

                            <div className="size-options">
                                <h3>Select Size:</h3>
                                <div className="size-boxes">
                                    {product.variants.map((variant, index) => (
                                        <div
                                            key={index}
                                            onClick={() => setSelectedSize(variant.id)}
                                            className={`size-box ${selectedSize === variant.id ? "selected" : ""}`}
                                        >
                                            {variant.size}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="quantity-selector">
                                <h3>Quantity:</h3>
                                <div className="quantity-box">
                                    <button onClick={() => handleQuantityChange(-1)} className="quantity-btn">
                                        <FaMinus />
                                    </button>
                                    <span className="quantity-value">{quantity}</span>
                                    <button onClick={() => handleQuantityChange(1)} className="quantity-btn">
                                        <FaPlus />
                                    </button>
                                </div>
                            </div>

                            <div className="collapsible-section">
                                <button
                                    className={`collapsible-button ${showExtraContent ? "active" : ""}`}
                                    onClick={() => setShowExtraContent(!showExtraContent)}
                                >
                                    Product Details
                                    <span className="icon">{showExtraContent ? "-" : "+"}</span>
                                </button>
                                <div className={`collapsible-content ${showExtraContent ? "expanded" : ""}`}>
                                    <p>{product.description}</p>
                                </div>
                            </div>

                            <button
                                className="collapsible-button mt-5"
                                onClick={() => setShowSizeGuide(!showSizeGuide)}
                            >
                                Size Guide <AiOutlineDown className="size-guide-icon" />
                            </button>
                            {showSizeGuide && (
                                <div className="size-guide-content">
                                    <ul>
                                        <li><strong>S:</strong> Chest 34"-36", Waist 28"-30"</li>
                                        <li><strong>M:</strong> Chest 36"-38", Waist 30"-32"</li>
                                        <li><strong>L:</strong> Chest 38"-40", Waist 32"-34"</li>
                                        <li><strong>XL:</strong> Chest 42"-44", Waist 36"-38"</li>
                                    </ul>
                                </div>
                            )}

                            <AddToCartWithHoverCrosshair
                                onAddToCart={() => handleAddToCart(quantity)}
                                disabled={!selectedSize}
                                isLoading={isLoading}
                            />
                        </div>
                    </div>
                </div>
            )}
            <Suggested />
            <Footer />
        </>
    );
};

export default ProductPage;
