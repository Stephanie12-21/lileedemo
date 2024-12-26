"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { toast, Toaster } from "sonner";
import AnimatedSymbol from "../../Sections/Loading/AnimatedSymbol";
import { useState } from "react";

const TopHeader = () => {
  return (
    <div className="relative p-8">
      <div className="justify-between items-center flex ">
        <div className="flex items-center gap-4">
          <ListContacts />
        </div>
        <div className="flex items-end gap-4">
          <ListButton />
        </div>
      </div>
    </div>
  );
};

export const ListButton = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  if (isLoaded)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#15213d]">
        <AnimatedSymbol />
      </div>
    );

  return (
    <div className="flex gap-2 items-center">
      <div className="flex gap-2">
        <Toaster position="top-right" className="text-[20px] font-semibold" />
        <Button
          className="px-5 rounded-[10px] text-[16px]  text-white font-semibold bg-transparent border-[1px] hover:bg-transparent hover:text-white"
          variant="outline"
          onClick={() =>
            toast("", {
              description: (
                <div>
                  <span style={{ fontSize: "17px", fontStyle: "semibold" }}>
                    Le dépôt d&apos;annonces est strictement gratuit.
                    <br />
                    <br />
                    Cependant, cette fonctionnalité ne sera disponible que
                    prochainement.
                    <br />
                    <br />
                    En attendant, Nous vous prions alors de bien vouloir vous
                    abonner à notre newsletter et soyez les premiers avertis.
                    <br />
                    <br />
                  </span>
                  <div className="mt-2">
                    <span
                      className="text-[#15213d] text-[17px] hover:underline font-semibold cursor-pointer"
                      onClick={() => toast.dismiss()}
                    >
                      Très bien, d&apos;accord
                    </span>
                  </div>
                </div>
              ),
              duration: 30000,
            })
          }
        >
          Déposer une annonce
        </Button>
      </div>
    </div>
  );
};

export function ListContacts() {
  const dataContacts = [
    {
      name: "Lilee",
      url: "https://maps.app.goo.gl/cHCgfdiczhJN6CQW9",
      img: "/icons/icons(1).svg",
    },
    {
      name: "06.50.37.68.37",
      url: "06.50.37.68.37",
      img: "/icons/icons(8).svg",
    },
    {
      name: "contact@lilee.fr",
      url: "contact@lilee.fr",
      img: "/icons/icons(7).svg",
    },
  ];
  return (
    <div className="items-center gap-10 flex">
      {dataContacts.map((i, index) => (
        <Link
          key={index}
          href={i.url}
          className="inline-flex space-x-2 items-center"
        >
          <Image
            src={i.img}
            width={24}
            height={24}
            alt="img"
            className="hover:scale-110 transition-transform duration-200"
          />
          <span className="text-[16px] text-white font-semibold visible max-md:hidden">
            {i.name}
          </span>
        </Link>
      ))}
    </div>
  );
}

export const ListIcons = () => {
  const dataIcons = [
    {
      url: "https://www.facebook.com/lileelogementspmr?locale=fr_FR",
      img: "/icons/icons(6).svg",
      name: "Facebook",
    },
    {
      url: "https://www.youtube.com/@lileepmr",
      img: "/icons/icons(3).svg",
      name: "YouTube",
    },
    {
      url: "https://www.linkedin.com/company/86267153/admin/",
      img: "/icons/icons(2).svg",
      name: "LinkedIn",
    },
    {
      url: "https://www.instagram.com/lilee.fr/",
      img: "/icons/icons(4).svg",
      name: "Instagram",
    },
  ];

  return (
    <div className="flex justify-center items-center gap-x-10">
      {dataIcons.map((icon, index) => (
        <div key={index} className="flex flex-col items-center ">
          <Link href={icon.url} target="_blank" rel="noopener noreferrer">
            <Image
              src={icon.img}
              width={32}
              height={32}
              alt={icon.name}
              className="hover:scale-110 transition-transform duration-200"
            />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default TopHeader;
