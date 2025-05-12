"use client"
import { Link } from 'lucide-react';
import Image from 'next/image';


const Cook = () => {

    return (
        <section className='relative' id="cook-section">
            <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md">
                <div className='absolute right-0 bottom-[-18%] hidden lg:block'>
                    <Image src={'/images/cook/burger.png'} alt="burger-image" width={463} height={622} />
                </div>
                <div className='grid grid-cols-1 lg:grid-cols-12 my-16 space-x-5'>
                    <div className='col-span-6 flex justify-start'>
                        <Image src="/images/cook/cook.png" alt="nothing" width={636} height={808} />
                    </div>
                    <div className='col-span-6 flex flex-col justify-center'>
                        <p className='text-primary text-lg font-normal mb-3 tracking-widest uppercase text-start'>cook with us</p>
                        <h2 className="text-3xl lg:text-5xl font-semibold text-black dark:text-white text-start">
                        Stop Searching,
                        Start Cooking!.
                        </h2>
                        <p className='text-black/50 dark:text-white/50 md:text-lg font-normal mb-10 text-start mt-2'>Ready to level up your kitchen game? At NaanStop, we're not just sharing recipes — we're inviting you to cook, create, and crave together.

Whether you’re a spice whisperer or still figuring out how not to burn toast, we’ve got you. Our easy-to-follow recipes, step-by-step tutorials, and mouthwatering visuals make cooking fun, fast, and fuss-free.</p>
                        <p className='text-black/50 dark:text-white/50 md:text-lg font-normal mb-10 text-start mt-1'>🔥 What’s cooking?
                        <ul>🍴Quick bites for when life’s in a rush</ul>
                        <ul>🍴Comfort food that hugs your soul</ul>
                        <ul>🍴Vegan, meal-prep, and desi faves
                        </ul>
                        <ul>🍴Chef tips and secret hacks
                        </ul>
                        <ul>Cravings matched with what’s in your fridge</ul></p>
                    </div>
                </div>
            </div>
        </section >
    )
}

export default Cook;
