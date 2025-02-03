"use client";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation } from "swiper/modules";
import Image from "next/image";

export default function Hero() {
  const swiperRef = useRef(null);

  const handlePrev = () => {
    swiperRef.current?.swiper.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.swiper.slideNext();
  };

  return (
    <div className="relative p-4 sm:p-6 md:p-8">
      <Swiper
        ref={swiperRef}
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: true,
        }}
        modules={[Autoplay, Navigation]}
        className="w-full h-[400px] sm:h-[550px] md:h-[400px] lg:h-[400px] xl:h-[400px] rounded-lg sm:rounded-xl md:rounded-2xl shadow sm:shadow-md md:shadow-lg lg:shadow-xl xl:shadow-2xl"
      >
        {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
          <SwiperSlide
            key={index}
            className="flex items-center justify-center text-center bg-white shadow-lg rounded-lg"
          >
            <div className="flex flex-col md:flex-row justify-center items-center w-full h-full p-4 sm:p-6 md:p-8 lg:p-10">
              <div className="flex flex-col justify-center items-start text-left w-full md:w-1/2 mb-4 md:mb-0">
                <h1 className="text-2xl sm:text-3xl md:text-2xl lg:text-2xl text-[#15213D] font-poppins font-semibold mb-4">
                  {getTitle(index)}
                </h1>
                <p className="text-base sm:text-base md:text-xl lg:text-xl text-[#263056]">
                  {getDescription(index)}
                </p>
              </div>
              <div className="w-full md:w-1/2 flex justify-center items-center">
                <Image
                  src={`/hero-carrousel/photo(${index}).svg`}
                  width={300}
                  height={400}
                  alt={`Hero image ${index}`}
                  className="w-full max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[350px] h-auto object-contain"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        onClick={handlePrev}
        className="absolute left-2 sm:left-4 md:left-6 lg:left-8 top-1/2 transform -translate-y-1/2 p-2 bg-gray-200 rounded-full shadow-md z-10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-black"
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
        className="absolute right-2 sm:right-4 md:right-6 lg:right-8 top-1/2 transform -translate-y-1/2 p-2 bg-gray-200 rounded-full shadow-md z-10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-black"
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

function getTitle(index) {
  const titles = [
    "Vous avez du mal à trouver la maison idéale pour vos vacances ?",
    "Vous souhaitez assister des personnes à mobilité réduite?",
    "Vous vous faites du souci à trouver la voiture idéale pour vos déplacements?",
    "Trouvez des équipements parfaitement adaptés à vos besoins et votre situation.",
    "Vous souhaitez apporter votre soutien à des personnes en situation de handicap ?",
    "Vous peinez à trouver des loisirs et des activités pour vos vacances ?",
    "Vous souhaitez acheter des vêtements adaptées à une certaine situation de handicap?",
    "Vous souhaitez acheter ou vendre du mobilier adapté à votre situation?",
  ];
  return titles[index - 1];
}

function getDescription(index) {
  const descriptions = [
    "Ne cherchez plus ! Découvrez ici une sélection de biens immobiliers parfaitement adaptés à vos besoins.",
    "Vous êtes au bon endroit. Déposez vos annonces ici.",
    "Trouvez ici toute une large gamme de voitures répondant à vos critères",
    "Découvrez ici toutes les pépites dont vous avez besoin.",
    "Partagez ici vos annonces et faites une différence dans leur quotidien.",
    "Ne vous inquiétez pas ! Découvrez ici une variété d'activités amusantes.",
    "Vous êtes au bon endroit. Trouvez ici tout ce dont vous aurez besoin.",
    "Trouvez ici tout ce dont il vous faut.",
  ];
  return descriptions[index - 1];
}
