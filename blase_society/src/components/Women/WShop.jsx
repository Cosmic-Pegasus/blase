import React from "react";
import Shop from "../Shop/Shop";

const WShop = () => {
    const products = [
        {
          id: 1,
          name: 'Sneakers Alpha',
          price: 79.99,
          image1: '/Products/women/w (27).jpg',
          image2: '/Products/women/w (28).jpg',
          link: '/product/ex1',
        },
        {
          id: 2,
          name: 'Urban Kicks',
          price: 289.99,
          image1: '/Products/women/w (11).jpg',
          image2: '/Products/women/w (12).jpg',
          link: '/product/urban-kicks',
        },
        {
          id: 3,
          name: 'Street Runner',
          price: 399.99,
          image1: '/Products/women/w (20).jpg',
          image2: '/Products/women/w (21).jpg',
          link: '/product/street-runner',
        },
        {
          id: 4,
          name: 'Retro Style',
          price: 649.99,
          image1: '/Products/women/w (26).jpg',
          image2: '/Products/women/w (25).jpg',
          link: '/product/retro-style',
        },
        {
          id: 5,
          name: 'Sneakers Alpha',
          price: 795.99,
          image1: '/Products/women/w (16).jpg',
          image2: '/Products/women/w (17).jpg',
          link: '/product/sneakers-alpha',
        },
        {
          id: 6,
          name: 'Urban Kicks',
          price: 869.99,
          image1: '/Products/women/w (2).jpg',
          image2: '/Products/women/w (3).jpg',
          link: '/product/urban-kicks',
        },
        {
          id: 7,
          name: 'Street Runner',
          price: 5599.99,
          image1: '/Products/women/w (23).jpg',
          image2: '/Products/women/w (24).jpg',
          link: '/product/street-runner',
        },
        {
          id: 8,
          name: 'Retro Style',
          price: 6659.99,
          image1: '/Products/women/w (32).jpg',
          image2: '/Products/women/w (33).jpg',
          link: '/product/retro-style',
        },
        // Add more products as needed
      ];

  return <Shop products={products} />;
};

export default WShop;
