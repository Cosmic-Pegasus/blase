import React from 'react'
import '../CSS/Arrivals.css'

export default function WSuggested() {

    const products = [
        { id: 1, name: 'CORDA TOP', color: 'CAROB / TOSCA', price: '$70', image: '/Products/women/w (2).jpg' },
        { id: 2, name: 'ORACLE TOP', color: 'LIME', price: '$122', image: '/Products/women/w (6).jpg' },
        { id: 3, name: 'CORDA BOTTOM', color: 'BLACK / PEAR', price: '$58', image: '/Products/women/w (7).jpg' },
        { id: 4, name: 'VISION ONE PIECE', color: 'AZURE', price: '$136', image: '/Products/women/w (8).jpg' },
    ];

    return (
        <section className="wsection">
            <div className="wsection-header">
                <h1 className='my-8'>
                    Some <em>Suggestions</em>
                </h1>
                
            </div>
            <div className="wproduct-grid">
                {products.map((product) => (
                    <div key={product.id} className="wproduct-card">
                        <img src={product.image} alt={product.name} />
                        <div className="wproduct-info">
                            <h3 className="wproduct-name">{product.name}</h3>
                            <p className="wproduct-color">{product.color}</p>
                            <p className="wproduct-price">{product.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};



