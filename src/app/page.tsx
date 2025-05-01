import React from "react";
import Hero from "@/components/Home/Hero";
import Features from "@/components/Home/Features";
import Cook from "@/components/Home/Cook";
import Expert from "@/components/Home/Expert";
import Gallery from "@/components/Home/Gallery";
import Newsletter from "@/components/Home/Newsletter";
import { Metadata } from "next";
import ThemeToggler from "@/components/Layout/Header/ThemeToggler";
export const metadata: Metadata = {
  title: "TheNaanStop",
};

export default function Home() {
  return (
    <main>
      <Hero />
      <Gallery />
      <Features />
      <Cook />
      <Expert />
      <Newsletter />
    </main>
  );
}
