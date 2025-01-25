import React from 'react'
import Category from './components/Category';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Quality from './components/Quality';
import SwiperCarousel from './components/SwiperCarousel';
import Slider from './components/Slider';
import RotatingTape from './components/RotatingTape';
import CollectionSection from './components/CollectionSection';
import Gallery from './components/Gallery';
import TopCollection from './components/Collections/TopCollection';
import BottomCollection from './components/Collections/BottomCollection';
import Tops from './components/Collections/Tops';
import Bottoms from './components/Collections/Bottoms';
import Essentials from './components/Collections/Essentials';
import Products from './Products';



export default function Home() {
  return (
    <>

      <Navbar position="fixed" />
      <SwiperCarousel />
      <RotatingTape />
      <Slider />

      {/* <ShoeSlider link='/order' shoeName='Adidas : D Rose Ultimate Edition' img={img} price='500$' /> */}
      {/* <Category /> */}
      <TopCollection />
      <Tops />
      <BottomCollection />
      <Bottoms />
      <Essentials/>
      {/* <CollectionSection /> */}
      {/* <NewArrival /> */}
      {/* <Trending /> */}

      {/* <Brand /> */}
      {/* <Quality /> */}
      <Footer />
    </>
  )
}
