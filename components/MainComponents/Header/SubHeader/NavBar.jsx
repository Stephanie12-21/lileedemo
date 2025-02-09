"use client";
import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaEllipsisV } from "react-icons/fa";
import AnimatedSymbol from "../../Sections/Loading/AnimatedSymbol";
import { signOut, useSession } from "next-auth/react";
import { toast, Toaster } from "sonner";

const links = [
  { path: "/", name: "Accueil" },
  { path: "/Annonces", name: "Annonces" },
  { path: "/Contact", name: "Contact" },
  { path: "/Blog", name: "Blog & Presse" },
];

export default function NavBar() {
  const path = usePathname();
  const [toggle, setToggle] = useState(false);
  const { data: session, status } = useSession();
  const [isLoaded, setIsLoaded] = useState(false);

  const toggleMenu = useCallback(() => {
    setToggle((prevState) => !prevState);
  }, []);

  const handleSignOut = useCallback(() => {
    signOut();
  }, []);

  const getRolePath = useCallback(() => {
    const role = session?.user?.role;
    if (role === "PERSO") return "/personnel/";
    if (role === "PRO") return "/professionnel";
    if (role === "ADMIN") return "/admin";
    return "";
  }, [session]);

  const rolePath = session ? getRolePath() : "";
  const profileUrl = `${rolePath}/profile/${session?.user?.id}`;
  const securityUrl = `${rolePath}/security/${session?.user?.id}`;
  const clientSpaceUrl = rolePath;

  const handleToast = () => {
    toast("", {
      description: (
        <div className="text-xs sm:text-sm">
          <span className="font-semibold">
            Le dépôt d&apos;annonces est strictement gratuit.
            <br />
            Cependant, cette fonctionnalité ne sera disponible que
            prochainement.
            <br />
            En attendant, nous vous prions de bien vouloir vous abonner à notre
            newsletter et soyez les premiers avertis.
          </span>
          <div className="mt-2">
            <span
              className="text-[#15213d] hover:underline font-semibold cursor-pointer"
              onClick={() => toast.dismiss()}
            >
              Très bien, d&apos;accord
            </span>
          </div>
        </div>
      ),
    });
  };

  if (isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#15213d]">
        <AnimatedSymbol />
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-28">
        <div className="text-center">
          <Menu className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-base text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  const NavLink = ({ link, onClick = () => {} }) => (
    <Link
      href={link.path}
      className="relative capitalize text-white text-sm sm:text-base font-semibold"
      onClick={onClick}
    >
      {link.name}
      {link.path === path && (
        <motion.span
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "tween", duration: 0.3 }}
          layoutId="underline"
          className="absolute left-0 bottom-0 w-full h-[3px] bg-white"
        />
      )}
      <motion.span
        whileHover={{ scaleX: 1 }}
        whileFocus={{ scaleX: 1 }}
        initial={{ scaleX: 0 }}
        transition={{ type: "tween", duration: 0.3 }}
        className="absolute left-0 bottom-0 w-full h-[3px] bg-white"
      />
    </Link>
  );

  return (
    <div className="relative py-2 sm:py-4 px-4 sm:px-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/assets/Logo_site.svg"
              width={100}
              height={36}
              alt="Logo"
              className="w-24 sm:w-32 md:w-40"
            />
          </Link>
        </div>

        <nav className="hidden lg:flex justify-center items-center gap-4 sm:gap-8 flex-1">
          {links.map((link) => (
            <NavLink key={link.path} link={link} />
          ))}
        </nav>

        <button
          onClick={toggleMenu}
          className="lg:hidden text-white p-2"
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>

        {toggle && (
          <div className="fixed top-0 right-0 z-50 bg-[#15213d] flex flex-col items-end justify-start h-full w-64 p-4">
            <button
              onClick={toggleMenu}
              className="text-white p-2 self-end mb-4"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
            <div className="flex flex-col items-center gap-8 mb-8 w-full">
              {links.map((link) => (
                <NavLink key={link.path} link={link} onClick={toggleMenu} />
              ))}
            </div>
            <div className="flex flex-col gap-4 w-full">
              <Button
                className="w-full px-4 py-2 rounded-[10px] text-sm text-white font-semibold bg-transparent border border-white hover:bg-white hover:text-[#15213d]"
                variant="outline"
                onClick={() => {
                  handleToast();
                  toggleMenu();
                }}
              >
                Déposer une annonce
              </Button>
              <Button
                asChild
                className="w-full px-4 py-2 rounded-[10px] text-sm font-semibold bg-white text-[#15213d] hover:bg-transparent hover:text-white border border-white"
                onClick={toggleMenu}
              >
                <Link href="/login">Se connecter</Link>
              </Button>
            </div>
          </div>
        )}

        <div className="hidden lg:flex items-center">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 bg-dark rounded-full p-2">
                  <Image
                    src={session.user.image || "/default-avatar.png"}
                    alt="User profile"
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                  <span className="text-orange-500 font-bold text-xs sm:text-sm hidden md:inline">
                    {session.user.nom} {session.user.prenom}
                  </span>
                  <FaEllipsisV className="text-gray-400 text-xs sm:text-sm" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56 sm:w-64 mt-2">
                <DropdownMenuLabel>
                  <p className="text-orange-500 font-bold text-sm sm:text-base">
                    {session.user.nom} {session.user.prenom}
                  </p>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    {session.user.email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href={profileUrl}>Votre profil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={securityUrl}>Sécurité</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={clientSpaceUrl}>Espace utilisateur</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Button
                    variant="outline"
                    onClick={handleSignOut}
                    className="w-full text-xs sm:text-sm"
                  >
                    Se déconnecter
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button
                className="px-2 sm:px-4 py-1 sm:py-2 rounded-[10px] text-xs sm:text-sm text-white font-semibold bg-transparent border border-white hover:bg-white hover:text-[#15213d]"
                variant="outline"
                onClick={handleToast}
              >
                Déposer une annonce
              </Button>
              <Button
                asChild
                className="px-2 sm:px-4 py-1 sm:py-2 rounded-[10px] text-xs sm:text-sm font-semibold bg-white text-[#15213d] hover:bg-transparent hover:text-white border border-white"
              >
                <Link href="/login">Se connecter</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
