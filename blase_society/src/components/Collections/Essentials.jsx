import React, { useState } from "react";
import "../CSS/Slider.css";

const Essentials = () => {
    const products = [
        {
            id: 1,
            img: "/Products/1.webp",
            hoverImg: "/Products/1h.webp",
            name: "Classic T-Shirt",
            price: "$25",
            quantity: "In Stock",
            link: "#",
        },
        {
            id: 2,
            img: "/Products/denim.webp",
            hoverImg: "/Products/2h.webp",
            name: "Denim Jacket",
            price: "$55",
            quantity: "Limited Stock",
            link: "#",
        },
        {
            id: 3,
            img: "/Products/3.webp",
            hoverImg: "/Products/3h.webp",
            name: "Summer Hat",
            price: "$18",
            quantity: "In Stock",
            link: "#",
        },
        {
            id: 4,
            img: "/Products/4.webp",
            hoverImg: "/Products/4h.webp",
            name: "Sneakers",
            price: "$80",
            quantity: "Out of Stock",
            link: "#",
        },
        {
            id: 5,
            img: "/Products/1.webp",
            hoverImg: "/Products/1h.webp",
            name: "Leather Bag",
            price: "$120",
            quantity: "In Stock",
            link: "#",
        },
        {
            id: 6,
            img: "/Products/2h.webp",
            hoverImg: "/Products/2.webp",
            name: "Leather Bag",
            price: "$120",
            quantity: "In Stock",
            link: "#",
        },
        {
            id: 7,
            img: "/Products/3h.webp",
            hoverImg: "/Products/3.webp",
            name: "Leather Bag",
            price: "$120",
            quantity: "In Stock",
            link: "#",
        },
     
    ];



    return (
        <div className="slider-container">
            {/* Title */}
            <div className="slider-header">
                <h2 className="slider-title">ESSENTIALS</h2>
            </div>

            {/* Product Grid */}
            <div className="product-grid">
                {products.map((product) => (
                    <div className="product-card" key={product.id}>
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
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Essentials;
