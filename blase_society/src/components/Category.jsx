import React from 'react'
import './CSS/Style.css'


export default function Category() {
  return (
    <>
     
      <section className='category'>
        <h1 className="Brand-heading">SHOP BY CATEGORY</h1>
        <div className="category-container">
          <div className="categories"><a href=""><img src="/Products/insta (7).jpg" className='category-img' alt="" /></a><div className="category-title">MEN</div></div>
          <div className="categories"><a href=""><img src="/Products/women.webp" className='category-img' alt="" /></a><div className="category-title">WOMEN</div></div>
        </div>
      </section>
    </>
  )
}
