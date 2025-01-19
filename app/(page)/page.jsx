import Annonce from "@/components/MainComponents/Sections/Annonce/Annonce";
import Faq from "@/components/MainComponents/Sections/Faq/Faq";
import Hero from "@/components/MainComponents/Sections/Hero/Hero";
import Informations from "@/components/MainComponents/Sections/Informations/Informations";
import Partenaires from "@/components/MainComponents/Sections/Partenaires/Partenaires";
import Sponsors from "@/components/MainComponents/Sections/Sponsors/Sponsors";
import { Testimonial } from "@/components/MainComponents/Sections/Testimonials/Testimonials";
import React from "react";

const Home = () => {
  return (
    <main className="p-8">
      <Hero />
      <Annonce />
      <Informations />
      <Faq />
      <Testimonial />
      <Sponsors />
      {/* <Partenaires /> */}
    </main>
  );
};

export default Home;
