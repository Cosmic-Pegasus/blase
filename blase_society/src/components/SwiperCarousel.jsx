import React, { useRef, useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import SneakersCarouselImg1 from './Images/Nice/Sombra.png'
import jordan from './Images/Nice/Jordan.mp4'
import SneakersCarouselImg2 from './Images/Nice/racks.png'
import SneakersCarouselImg3 from './Images/Nice/mag.png'


import 'swiper/css';
import 'swiper/css/pagination';

import './CSS/Swiper.css';


import { Autoplay, Pagination } from 'swiper/modules';

export default function SwiperCarousel() {
    return (
        <>
            <Swiper
                direction={'horizontal'}
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 5500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination]}
                className="relative top-0 homeCarousel"
            >
                {/* <SwiperSlide> <img
                    src={SneakersCarouselImg1}
                    className="block w-full" id='img-size'
                    alt=""
                />  </SwiperSlide> */}
                {/* <SwiperSlide> <video src={jordan} autoPlay muted loop className='relative top-0 w-full'></video>  </SwiperSlide> */}
                <SwiperSlide> <img
                  src="/Products/1.png"
                    className="block w-full" id='img-size'
                    alt=""
                />  </SwiperSlide>
                <SwiperSlide> <img
                  src="/Products/4.png"
                    className="block w-full" id='img-size'
                    alt=""
                />  </SwiperSlide>
                <SwiperSlide> <img
                  src="/Products/5.png"
                    className="block w-full" id='img-size'
                    alt=""
                />  </SwiperSlide>
                <SwiperSlide> <img
                  src="/Products/2.png"
                    className="block w-full" id='img-size'
                    alt=""
                />  </SwiperSlide>
                <SwiperSlide> <img
                   src="/Products/3.png"
                    className="block w-full" id='img-size'
                    alt=""
                />  </SwiperSlide>


            </Swiper>
        </>
    );
}
