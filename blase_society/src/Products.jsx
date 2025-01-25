import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from './queries'; // Import the GraphQL query
import './a.css';

const Products = () => {
  const { loading, error, data } = useQuery(GET_PRODUCTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="products-container">
      {data.products.edges.map(({ node }) => (
        <div className="product-card" key={node.id}>
          <img
            src={node.images.edges[0]?.node.src}
            alt={node.title}
            className="product-image"
          />
          {node.images.edges[1]?.node.src && (
            <img
              src={node.images.edges[1]?.node.src}
              alt={`${node.title} hover`}
              className="product-hover-image"
            />
          )}
          <h2 className="product-title">{node.title}</h2>
          <p className="product-price">
            {node.priceRange.minVariantPrice.currencyCode}{' '}
            {node.priceRange.minVariantPrice.amount}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Products;
