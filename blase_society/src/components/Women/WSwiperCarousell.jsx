import React, { useRef, useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';

import './CSS/Swiper.css';


import { Autoplay, Pagination } from 'swiper/modules';

export default function WSwiperCarousel() {
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
                className="relative "
            >
                {/* <SwiperSlide> <img
                    src={SneakersCarouselImg1}
                    className="block w-full" id='img-size'
                    alt=""
                />  </SwiperSlide> */}
                {/* <SwiperSlide> <video src={jordan} autoPlay muted loop className='relative top-0 w-full'></video>  </SwiperSlide> */}
                <SwiperSlide> <img
                  src="/Products/women/10.png"
                    className="block w-full" id='img-size'
                    alt=""
                />  </SwiperSlide>
                <SwiperSlide> <img
                  src="/Products/women/11.png"
                    className="block w-full" id='img-size'
                    alt=""
                />  </SwiperSlide>
                <SwiperSlide> <img
                  src="/Products/women/12.png"
                    className="block w-full" id='img-size'
                    alt=""
                />  </SwiperSlide>
         


            </Swiper>
        </>
    );
}
