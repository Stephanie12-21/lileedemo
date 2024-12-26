"use client";

import Footer from "@/components/MainComponents/Footer/Footer";
import Header from "@/components/MainComponents/Header/Header";
import AnimatedSymbol from "@/components/MainComponents/Sections/Loading/AnimatedSymbol";
import React, { useEffect, useState } from "react";

const Layout = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#15213d]">
        <AnimatedSymbol />
      </div>
    );
  }

  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
