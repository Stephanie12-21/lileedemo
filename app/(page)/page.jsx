import Faq from "@/components/MainComponents/Sections/Faq/Faq";
import Hero from "@/components/MainComponents/Sections/Hero/Hero";
import Informations from "@/components/MainComponents/Sections/Informations/Informations";
import Partenaires from "@/components/MainComponents/Sections/Partenaires/Partenaires";
import Sponsors from "@/components/MainComponents/Sections/Sponsors/Sponsors";
import React from "react";

const Home = () => {
  return (
    <main className="p-8">
      <Hero />
      <Informations />
      <Faq />
      <Sponsors />
      <Partenaires />
    </main>
  );
};

export default Home;
