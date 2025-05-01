"use client"
import Slider from "react-slick";
import React from "react";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ExpertData } from "@/app/api/data";

const Expert = () => {
    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        speed: 100,
        cssEase: "linear",
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 450,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };

    return (
        <section className="bg-primary/15">
            <div className='container mx-auto lg:max-w-screen-xl md:max-w-screen-md'>
                <div className="text-center">
                    <p className='text-primary text-lg font-normal mb-3 tracking-widest uppercase'>Yummy Dishes</p>
                    <h2 className="text-3xl lg:text-5xl font-semibold text-black dark:text-white">
                        Most Favorite
                    </h2>
                </div>
                <Slider {...settings}>
                    {ExpertData.map((items, i) => (
                        <div key={i}>
                            <div className='m-3 py-14 my-10 text-center'>
                                <div className="relative w-80 h-80 mx-auto rounded-full overflow-hidden">
                                    <Image 
                                        src={items.imgSrc} 
                                        alt={items.name} 
                                        layout="fill" // Fills the box
                                        objectFit="cover" // Ensures image covers the box area without stretching
                                        className="object-cover"
                                    />
                                </div>
                                <h3 className='text-center text-2xl font-semibold text-lightblack mt-10'>
                                    {items.name}
                                </h3>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    )
}

export default Expert;
