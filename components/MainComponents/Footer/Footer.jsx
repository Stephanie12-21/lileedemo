import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToastContainer, toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/Blog", label: "Blog & presse" },
  { href: "/Contact", label: "Nous contacter" },
  {
    href: "/Politique_de_confidentialites",
    label: "Politique de confidentialité",
  },
  { href: "/Conditions_generales", label: "Conditions générales" },
];

const rubriques = [
  "Immobilier",
  "Emplois",
  "Voitures",
  "Matériels",
  "Dons",
  "Loisirs",
  "Vêtements",
];
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
  // {
  //   url: "https://www.instagram.com/lilee.fr/",
  //   img: "/icons/tiktok.svg",
  //   name: "TikTok",
  // },
  // {
  //   url: "https://www.instagram.com/lilee.fr/",
  //   img: "/icons/snapchat.svg",
  //   name: "Snapchat",
  // },
  // {
  //   url: "https://www.instagram.com/lilee.fr/",
  //   img: "/icons/twitter.svg",
  //   name: "Twitter",
  // },
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

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Veuillez entrer un email valide");
      return;
    }

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Vous êtes bien abonné à la newsletter !");
        setEmail("");
      } else if (response.status === 409) {
        toast.error("Vous êtes déjà abonné avec cet email.");
        setEmail("");
      } else {
        toast.error("Erreur lors de l'abonnement. Essayez à nouveau.");
        setEmail("");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      toast.error("Erreur lors de la connexion au serveur.");
    }
  };
  return (
    <footer className="bg-[#15213D] py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="flex flex-col space-y-4">
            <Image
              src="/assets/Logo_site.svg"
              alt="logo du site Lilee"
              width={140}
              height={50}
            />
            <p className="text-white text-base">
              Lilee a été crée dans le but de faciliter les recherches de
              logements, des équipements et autres indipensables de vie pour
              aider les personnes PMR (Personnes à Mobilité Réduite). Lilee
              offre un espace de publication d&apos;annonces qui sont vérifiées
              et validées par des professionnels de l&apos;aménagement du
              Handicap afin d&apos;aider aux mieux les personnes dans leurs
              recherches.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h2 className="font-bold text-2xl text-white mb-4">Rubriques</h2>
              <div className="space-y-2">
                {rubriques.map((rubrique, index) => (
                  <p key={index} className="text-white text-base">
                    {rubrique}
                  </p>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-bold text-2xl text-white mb-4">Divers</h2>
              <div className="space-y-2">
                {links.map((link, index) => (
                  <div key={index}>
                    <Link
                      href={link.href}
                      className="text-white text-base hover:underline"
                    >
                      {link.label}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <h2 className="text-xl font-bold text-white">
              Abonnez-vous à notre{" "}
              <span className="text-[#FCA311]">newsletter</span>
            </h2>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                id="userEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse email"
                className="bg-transparent text-white h-10"
              />
              <Button
                onClick={handleSubmit}
                className="bg-white text-[#15213D] hover:bg-[#FCA311] hover:text-white"
              >
                S&apos;abonner
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          {dataIcons.map((icon, index) => (
            <Link
              key={index}
              href={icon.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-2"
            >
              <Image
                src={icon.img || "/placeholder.svg"}
                width={32}
                height={32}
                alt={icon.name}
                className="hover:scale-110 transition-transform duration-200"
              />
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center text-[#71717A] text-base">
          © {currentYear} Conçu par{" "}
          <span className="text-[#fca311] font-semibold">Khepri Services</span>
        </div>
      </div>
      <ToastContainer />
    </footer>
  );
};

export default Footer;
