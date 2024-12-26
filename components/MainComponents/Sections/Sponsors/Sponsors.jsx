"use client";
import Image from "next/image";
import styles from "./scroll.module.css";

const Sponsors = () => {
  const sponsorLogos = [
    "/sponsors/logo(1).svg",
    "/sponsors/logo(2).svg",
    "/sponsors/logo(3).svg",
    "/sponsors/logo(4).svg",
    "/sponsors/logo(5).svg",
    "/sponsors/logo(6).svg",
    "/sponsors/logo(7).svg",
    "/sponsors/logo(8).svg",
    "/sponsors/logo(9).svg",
    "/sponsors/logo(10).svg",
  ];

  return (
    <div className="container mx-auto py-5">
      <h1 className="text-4xl font-bold text-[#15213d] text-center mt-20 ">
        Ils nous soutiennent
      </h1>
      <div className="overflow-hidden mt-20 relative w-full h-[150px]">
        <div className={`flex gap-16 ${styles.animateScroll}`}>
          {sponsorLogos.concat(sponsorLogos).map((logo, index) => (
            <Image
              key={index}
              src={logo}
              width={200}
              height={150}
              alt={`Logo sponsor ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sponsors;
