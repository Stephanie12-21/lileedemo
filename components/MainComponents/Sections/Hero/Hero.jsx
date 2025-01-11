// "use client";
// import React, { useRef } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import { Autoplay, Navigation } from "swiper/modules";
// import Logement from "./Carrousel/Logement";
// import Emploi from "./Carrousel/Emploi";
// import Voiture from "./Carrousel/Voiture";
// import Materiel from "./Carrousel/Materiel";
// import Don from "./Carrousel/Don";
// import Loisir from "./Carrousel/Loisir";
// import Vetement from "./Carrousel/Vetement";
// import Mobilier from "./Carrousel/Mobilier";

// export default function Hero() {
//   const swiperRef = useRef(null);

//   const handlePrev = () => {
//     swiperRef.current?.swiper.slidePrev();
//   };

//   const handleNext = () => {
//     swiperRef.current?.swiper.slideNext();
//   };

//   return (
//     <>
//       <div className="relative p-8">
//         <Swiper
//           ref={swiperRef}
//           spaceBetween={30}
//           centeredSlides={true}
//           autoplay={{
//             delay: 4000,
//             disableOnInteraction: true,
//           }}
//           modules={[Autoplay, Navigation]}
//           className="w-full h-[400px] rounded-[24px] shadow sm:shadow-md md:shadow-lg lg:shadow-xl xl:shadow-2xl"
//         >
//           <SwiperSlide className="flex items-center justify-center text-center text-lg  bg-white  shadow-lg rounded-lg">
//             <div className="flex justify-center items-center">
//               <Logement />
//             </div>
//           </SwiperSlide>
//           <SwiperSlide className="flex items-center justify-center text-center text-lg bg-white shadow-lg rounded-lg">
//             <div className="flex justify-center items-center">
//               <Emploi />
//             </div>
//           </SwiperSlide>
//           <SwiperSlide className="flex items-center justify-center text-center text-lg bg-white shadow-lg rounded-lg">
//             <div className="flex justify-center items-center">
//               <Voiture />
//             </div>
//           </SwiperSlide>
//           <SwiperSlide className="flex items-center justify-center text-center text-lg bg-white shadow-lg rounded-lg">
//             <div className="flex justify-center items-center">
//               <Materiel />
//             </div>
//           </SwiperSlide>
//           <SwiperSlide className="flex items-center justify-center text-center text-lg bg-white shadow-lg rounded-lg">
//             <div className="flex justify-center items-center">
//               <Don />
//             </div>
//           </SwiperSlide>
//           <SwiperSlide className="flex items-center justify-center text-center text-lg bg-white shadow-lg rounded-lg">
//             <div className="flex justify-center items-center">
//               <Loisir />
//             </div>
//           </SwiperSlide>
//           <SwiperSlide className="flex items-center justify-center text-center text-lg bg-[#ffff] shadow-lg rounded-lg">
//             <div className="flex justify-center items-center">
//               <Vetement />
//             </div>
//           </SwiperSlide>
//           <SwiperSlide className="flex items-center justify-center text-center text-lg bg-[#ffff] shadow-lg rounded-lg">
//             <div className="flex justify-center items-center">
//               <Mobilier />
//             </div>
//           </SwiperSlide>
//         </Swiper>

//         <button
//           onClick={handlePrev}
//           className="absolute left-14 top-1/2 transform -translate-y-1/2 p-2 bg-gray-200 rounded-full shadow-md"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             className="w-6 h-6 text-black"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M15 19l-7-7 7-7"
//             />
//           </svg>
//         </button>
//         <button
//           onClick={handleNext}
//           className="absolute right-14 top-1/2 transform -translate-y-1/2 p-2 bg-gray-200 rounded-full shadow-md"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             className="w-6 h-6 text-black"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M9 5l7 7-7 7"
//             />
//           </svg>
//         </button>
//       </div>
//     </>
//   );
// }

// "use client";

// import React, { useRef } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import { Autoplay, Navigation } from "swiper/modules";
// import Logement from "./Carrousel/Logement";
// import Emploi from "./Carrousel/Emploi";
// import Voiture from "./Carrousel/Voiture";
// import Materiel from "./Carrousel/Materiel";
// import Don from "./Carrousel/Don";
// import Loisir from "./Carrousel/Loisir";
// import Vetement from "./Carrousel/Vetement";
// import Mobilier from "./Carrousel/Mobilier";

// export default function Hero() {
//   const swiperRef = useRef(null);

//   const handlePrev = () => {
//     swiperRef.current?.swiper.slidePrev();
//   };

//   const handleNext = () => {
//     swiperRef.current?.swiper.slideNext();
//   };

//   // Tableau contenant les composants pour les slides
//   const slides = [
//     { component: <Logement />, bgColor: "bg-white" },
//     { component: <Emploi />, bgColor: "bg-white" },
//     { component: <Voiture />, bgColor: "bg-white" },
//     { component: <Materiel />, bgColor: "bg-white" },
//     { component: <Don />, bgColor: "bg-white" },
//     { component: <Loisir />, bgColor: "bg-white" },
//     { component: <Vetement />, bgColor: "bg-white" },
//     { component: <Mobilier />, bgColor: "bg-white" },
//   ];

//   return (
//     <div className="relative p-8">
//       <Swiper
//         ref={swiperRef}
//         spaceBetween={30}
//         centeredSlides={true}
//         autoplay={{
//           delay: 4000,
//           disableOnInteraction: true,
//         }}
//         modules={[Autoplay, Navigation]}
//         className="w-full h-[400px] rounded-[24px] shadow sm:shadow-md md:shadow-lg lg:shadow-xl xl:shadow-2xl"
//       >
//         {slides.map((slide, index) => (
//           <SwiperSlide
//             key={index}
//             className={`flex items-center justify-center text-center text-lg shadow-lg rounded-lg ${slide.bgColor}`}
//           >
//             <div className="flex justify-center items-center">
//               {slide.component}
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>

//       <button
//         onClick={handlePrev}
//         className="absolute left-14 top-1/2 transform -translate-y-1/2 p-2 bg-gray-200 rounded-full shadow-md"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//           className="w-6 h-6 text-black"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M15 19l-7-7 7-7"
//           />
//         </svg>
//       </button>
//       <button
//         onClick={handleNext}
//         className="absolute right-14 top-1/2 transform -translate-y-1/2 p-2 bg-gray-200 rounded-full shadow-md"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//           className="w-6 h-6 text-black"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M9 5l7 7-7 7"
//           />
//         </svg>
//       </button>
//     </div>
//   );
// }

"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation } from "swiper/modules";
import Image from "next/image";

const slides = [
  {
    title:
      "Vous souhaitez apporter votre soutien à des personnes en situation de handicap ?",
    description:
      "Partagez ici vos annonces et faites une différence dans leur quotidien.",
    image: "/hero-carrousel/photo(6).svg",
    bgColor: "bg-white",
  },
  {
    title: "Trouvez le logement idéal pour vos besoins.",
    description: "Explorez une large gamme d'annonces pour tous les budgets.",
    image: "/hero-carrousel/photo(7).svg",
    bgColor: "bg-gray-100",
  },
  // Ajoutez d'autres slides ici avec des titres, descriptions et images spécifiques.
];

export default function Hero() {
  const swiperRef = useRef(null);

  const handlePrev = () => {
    swiperRef.current?.swiper.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.swiper.slideNext();
  };

  return (
    <div className="relative p-8">
      <Swiper
        ref={swiperRef}
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: true,
        }}
        modules={[Autoplay, Navigation]}
        className="w-full h-[400px] rounded-[24px] shadow sm:shadow-md md:shadow-lg lg:shadow-xl xl:shadow-2xl"
      >
        {slides.map((slide, index) => (
          <SwiperSlide
            key={index}
            className={`flex items-center justify-center text-center text-lg shadow-lg rounded-lg ${slide.bgColor}`}
          >
            <div className="flex justify-between items-center mx-auto container px-4 md:px-8 gap-20">
              <div className="flex flex-col pt-14 max-md:pt-0 gap-9 text-start">
                <h1 className="text-4xl text-[#15213D] font-poppins font-semibold">
                  {slide.title}
                </h1>
                <p className="text-[#263056]">{slide.description}</p>
              </div>
              <div className="relative flex-1 items-center max-md:hidden">
                <Image
                  src={slide.image}
                  width={300}
                  height={400}
                  alt="image"
                  className="lg:min-w-[200px] md:min-w-[300px]"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        onClick={handlePrev}
        className="absolute left-14 top-1/2 transform -translate-y-1/2 p-2 bg-gray-200 rounded-full shadow-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6 text-black"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={handleNext}
        className="absolute right-14 top-1/2 transform -translate-y-1/2 p-2 bg-gray-200 rounded-full shadow-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6 text-black"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
