import React from 'react'
import WSwiperCarousel from './WSwiperCarousell'
import WArrivals from './WArrivals'
import WSection from './WSection'
import WSection2 from './WSection2'
import WFooter from './WFooter'
import WNavbar from './WNavbar'

export default function WomenHome() {
  return (
    <>
    <WNavbar/>
    <WSwiperCarousel/>
    <WArrivals/>
    <WSection/>
    <WSection2/>
    <WFooter/>
    </>
  )
}
