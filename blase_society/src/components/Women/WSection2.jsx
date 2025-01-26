import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './CSS/Section2.css';

export default function WSection2() {
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
                                products(first: 3, query: "tag:w-limited") {
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
        <section className="section2">
            <div className="section2-header">
                <h1 className="section2-title">
                    New <em>Limited</em> item
                </h1>
                <Link to="/women/shop" className="catalog-link2">
                    Go to Catalog ↗
                </Link>
            </div>

            <div className="product-grid2">
                {products.map((product, index) => (
                    <Link 
                        to={`/product/${product.handle}`}
                        key={product.id} 
                        className={`product-card2 product-card2-${index + 1}`}
                    >
                        <img
                            src={product.image}
                            alt={product.name}
                            className="product-image2"
                        />
                        <div className="product-info2">
                            <h3 className="product-name2">{product.name}</h3>
                            <p className="product-color2">{product.color}</p>
                            <p className="product-price2">{product.price}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
