import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './CSS/Arrivals.css';

export default function WArrivals() {
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
                                products(first: 4, query: "tag:w-new-arrivals") {
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
                                            images(first: 1) {
                                                edges {
                                                    node {
                                                        originalSrc
                                                    }
                                                }
                                            }
                                            variants(first: 1) {
                                                edges {
                                                    node {
                                                        title
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
                    name: node.title.toUpperCase(),
                    handle: node.handle,
                    color: node.variants.edges[0]?.node.title || '',
                    price: `₹${parseFloat(node.priceRange.minVariantPrice.amount).toFixed(2)}`,
                    image: node.images.edges[0]?.node.originalSrc,
                }));

                setProducts(fetchedProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <section className="wsection">
            <div className="wsection-header">
                <h1>
                    Explore <em>new arrivals</em>
                </h1>
                <Link to="/women/shop" className="wcatalog-link">Go to Catalog ↗</Link>
            </div>
            <div className="wproduct-grid">
                {products.map((product) => (
                    <Link 
                        to={`/product/${product.handle}`} 
                        key={product.id} 
                        className="wproduct-card"
                    >
                        <img src={product.image} alt={product.name} />
                        <div className="wproduct-info">
                            <h3 className="wproduct-name">{product.name}</h3>
                            <p className="wproduct-color">{product.color}</p>
                            <p className="wproduct-price">{product.price}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}



