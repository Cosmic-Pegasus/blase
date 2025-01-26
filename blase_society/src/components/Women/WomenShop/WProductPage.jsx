import React, { useState, useEffect } from "react";
import axios from "axios";
import "../CSS/WProductPage.css";
import { useParams, useNavigate } from "react-router-dom";
import WFooter from "../WFooter";
import WNavbar from "../WNavbar";
import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import WSuggested from "./WSuggested";
import AddToCartWithHoverCrosshair from "../../Shop/AddToCartWithCrosshair";
import { useMutation } from "@apollo/client";
import { ADD_TO_CART, CREATE_CART } from "../../Shop/Cart";

const WProductPage = () => {
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
                                            currencyCode
                                        }
                                        quantityAvailable
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
                        price: parseFloat(edge.node.price.amount),
                        quantityAvailable: edge.node.quantityAvailable,
                        size: edge.node.selectedOptions.find(
                            (option) => option.name.toLowerCase() === "size"
                        )?.value || "N/A",
                    })),
                });

                setSelectedImage(data.images.edges[0]?.node.originalSrc || "");
                setLoading(false);
            } catch (error) {
                console.error(error);
                navigate("/women/shop", { replace: true });
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

    const handleQuantityChange = (increment) => {
        setQuantity(prev => Math.max(1, prev + increment));
    };

    const handleAddToCart = async () => {
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
                            attributes: [
                                {
                                    key: "Size",
                                    value: selectedVariant.size
                                }
                            ]
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

    return (
        <>
            <WNavbar />
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="wfinal-product-page">
                    <div className="wcontent">
                        <div className="wgallery-section">
                            <div className="wproduct-image-grid">
                                {product.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image.src}
                                        alt={image.alt || `Product Image ${index + 1}`}
                                        className="wchild-grid-image"
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

                        <div className="winfo-section">
                            <h1 className="wfinal-product-name">{product.title}</h1>
                            <p className="wfinal-product-price">
                                ₹{selectedSize 
                                    ? product.variants.find(v => v.id === selectedSize)?.price.toFixed(2)
                                    : product.variants[0]?.price.toFixed(2)}
                            </p>

                            <div className="wsize-options">
                                <h3>Select Size:</h3>
                                <div className="wsize-boxes">
                                    {product.variants.map((variant, index) => (
                                        <div
                                            key={index}
                                            onClick={() => setSelectedSize(variant.id)}
                                            className={`wsize-box ${selectedSize === variant.id ? "selected" : ""}`}
                                        >
                                            {variant.size}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="wquantity-selector">
                                <h3>Quantity:</h3>
                                <div className="wquantity-box">
                                    <button 
                                        onClick={() => handleQuantityChange(-1)} 
                                        className="wquantity-btn"
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span className="wquantity-value">{quantity}</span>
                                    <button 
                                        onClick={() => handleQuantityChange(1)} 
                                        className="wquantity-btn"
                                        disabled={selectedSize && 
                                            quantity >= (product.variants.find(v => v.id === selectedSize)?.quantityAvailable || 0)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="wcollapsible-section">
                                <button className="wcollapsible-button">
                                    Product Details
                                    <span className="icon">+</span>
                                </button>
                                <div className="wcollapsible-content">
                                    <p>{product.description}</p>
                                </div>
                            </div>

                            <AddToCartWithHoverCrosshair
                                onAddToCart={() => handleAddToCart()}
                                disabled={!selectedSize}
                                isLoading={isLoading}
                            />
                        </div>
                    </div>
                </div>
            )}
            <WSuggested />
            <WFooter />
        </>
    );
};

export default WProductPage;

