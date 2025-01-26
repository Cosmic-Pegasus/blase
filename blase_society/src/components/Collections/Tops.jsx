import React, { useState, useEffect } from "react";
import "../CSS/Slider.css";
import { Link } from "react-router-dom";
import axios from 'axios';

const Tops = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const SHOPIFY_API_URL = "https://2499d0-e9.myshopify.com/api/2023-01/graphql.json";
            const SHOPIFY_ACCESS_TOKEN = "352164320ac49e869c945f919a199a85";

            try {
                const response = await axios.post(
                    SHOPIFY_API_URL,
                    {
                        query: `
                            query {
                                products(first: 8, query: "tag:tops") {
                                    edges {
                                        node {
                                            id
                                            title
                                            handle
                                            priceRange {
                                                minVariantPrice {
                                                    amount
                                                    currencyCode
                                                }
                                            }
                                            images(first: 2) {
                                                edges {
                                                    node {
                                                        originalSrc
                                                    }
                                                }
                                            }
                                            variants(first: 1) {
                                                edges {
                                                    node {
                                                        quantityAvailable
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        `
                    },
                    {
                        headers: {
                            'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                const fetchedProducts = response.data.data.products.edges.map(({ node }) => ({
                    id: node.id,
                    name: node.title,
                    handle: node.handle,
                    price: `₹${parseFloat(node.priceRange.minVariantPrice.amount).toFixed(2)}`,
                    img: node.images.edges[0]?.node.originalSrc,
                    hoverImg: node.images.edges[1]?.node.originalSrc || node.images.edges[0]?.node.originalSrc,
                    quantity: node.variants.edges[0]?.node.quantityAvailable > 0 ? "In Stock" : "Out of Stock"
                }));

                setProducts(fetchedProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="slider-container">
            {/* Title */}
            <div className="slider-header">
                <h2 className="slider-title">SHIRTS/TSHIRTS</h2>
            </div>

            {/* Product Grid */}
            <div className="product-grid">
                {products.map((product) => (
                    <Link to={`/product/${product.handle}`} className="product-card" key={product.id}>
                        <div className="product-image-wrapper">
                            <img
                                src={product.img}
                                alt={product.name}
                                className="product-img"
                            />
                            <img
                                src={product.hoverImg}
                                alt={`Hover ${product.name}`}
                                className="product-img-hover"
                            />
                        </div>
                        <div className="product-details">
                            <h3 className="product-name">{product.name}</h3>
                            <p className="product-price">{product.price}</p>
                            <p className={`product-quantity ${product.quantity === 'Out of Stock' ? 'out-of-stock' : ''}`}>
                                {product.quantity}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Tops;
