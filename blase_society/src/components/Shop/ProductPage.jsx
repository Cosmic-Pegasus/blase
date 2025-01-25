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
import { ADD_TO_CART } from "./Cart"; // Ensure this import path is correct

const ProductPage = () => {
    const { handle } = useParams();
    const navigate = useNavigate();
    const [addToCart] = useMutation(ADD_TO_CART);

    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [selectedSize, setSelectedSize] = useState(null);
    const [showFullImage, setShowFullImage] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);


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

    const handleAddToCart = async () => {
        if (!selectedSize) {
            alert("Please select a size.");
            return;
        }

        // Find the selected variant based on the selected size
        const selectedVariant = product.variants.find(variant => variant.id === selectedSize);

        if (!selectedVariant) {
            alert("Selected variant not found.");
            return;
        }

        setIsLoading(true);

        try {
            const existingCartId = localStorage.getItem("cartId");

            // If cart doesn't exist, create one
            if (!existingCartId) {
                const cartResponse = await createCart([]);
                const newCartId = cartResponse.data.cartCreate.cart.id;
                localStorage.setItem("cartId", newCartId);
            }

            // Add item to the cart using the cartId
            const response = await addToCart({
                variables: {
                    cartId: localStorage.getItem("cartId"),
                    lines: [{
                        merchandiseId: selectedVariant.id,
                        quantity: 1,
                    }]
                }
            });

            // Log detailed product information
            console.log('Added to cart:', {
                productName: product.title,
                variant: selectedVariant,
                size: selectedVariant.size,
                price: selectedVariant.price,
                response: response
            });
        } catch (error) {
            console.error("Failed to add product to cart:", error);
        } finally {
            setIsLoading(false);
        }
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
                                <img src={selectedImage} alt="Fullscreen View" />
                            </div>
                        )}

                        <div className="info-section">
                            <h1 className="final-product-name">{product.title}</h1>
                            <p className="final-product-desc">{product.description}</p>

                            <div className="size-options">
                                <h3>Select Size:</h3>
                                {product.variants.map((variant, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setSelectedSize(variant.id)}
                                        className={`variant ${selectedSize === variant.id ? "selected" : ""}`}
                                    >
                                        {variant.size} - ₹{variant.price}
                                    </div>
                                ))}
                            </div>

                            <AddToCartWithHoverCrosshair
                                onAddToCart={handleAddToCart}
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
