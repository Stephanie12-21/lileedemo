"use client";

import ReactCookieBot from "react-cookiebot";
import Annonce from "@/components/MainComponents/Sections/Annonce/Annonce";
import Faq from "@/components/MainComponents/Sections/Faq/Faq";
import Hero from "@/components/MainComponents/Sections/Hero/Hero";
import Informations from "@/components/MainComponents/Sections/Informations/Informations";
import Sponsors from "@/components/MainComponents/Sections/Sponsors/Sponsors";
import { Testimonial } from "@/components/MainComponents/Sections/Testimonials/Testimonials";
import React from "react";

const domainGroupId = "8877150d-f4a3-4413-adeb-12dcd85cc3b4";

const Home = () => {
  return (
    <div>
      <ReactCookieBot
        domainGroupId={domainGroupId}
        language="FR"
        data-lang="fr"
      />

      <main className="p-8">
        <Hero />
        <Annonce />
        <Informations />
        <Faq />
        <Testimonial />
        <Sponsors />
      </main>
    </div>
  );
};

export default Home;
