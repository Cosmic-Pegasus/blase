import React from 'react';
import './CSS/Section2.css';

export default function WSection2() {
  const products = [
    { id: 1, name: 'CORDA TOP', color: 'CAROB / TOSCA', price: '$70', image: '/Products/women/w (14).jpg' },
    { id: 2, name: 'ORACLE TOP', color: 'LIME', price: '$122', image: '/Products/women/w (15).jpg' },
    { id: 3, name: 'CORDA BOTTOM', color: 'BLACK / PEAR', price: '$58', image: '/Products/women/w (16).jpg' },
  ];

  return (
    <section className="section2">
      <div className="section2-header">
        <h1 className="section2-title">
          New <em>Limited</em> item
        </h1>
        <a href="#" className="catalog-link2">
          Go to Catalog ↗
        </a>
      </div>

      <div className="product-grid2">
        {products.map((product) => (
          <div key={product.id} className={`product-card2 product-card2-${product.id}`}>
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
          </div>
        ))}
      </div>
    </section>
  );
}
