import { Box, Heart, Info, Mail, Megaphone, TrendingUp } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FaBullhorn } from "react-icons/fa";

const Navigation = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const DataLinkNav = [
    { icon: FaBullhorn, name: "Annonces", href: "/professionnel/annonces" },
    { icon: Heart, name: "Favoris", href: "/professionnel/favoris" },
    {
      icon: Mail,
      name: "Messages",
      href: session ? `/professionnel/messages/${session.user.id}` : "#",
    },
    // {
    //   icon: Info,
    //   name: "Informations de paiement",
    //   href: session ? `/professionnel/InfoPaiement` : "#",
    // },
    {
      icon: TrendingUp,
      name: "Transactions",
      href: "/professionnel/transactions",
    },
  ];

  return (
    <nav className="grid items-start px-2 text-lg lg:px-4">
      <Linknav DataLinkNav={DataLinkNav} pathname={pathname} />
    </nav>
  );
};

export default Navigation;

function Linknav({ DataLinkNav, pathname }) {
  return (
    <>
      {DataLinkNav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-white focus:text-white ${
            pathname === item.href ? "text-white" : ""
          }`}
        >
          <item.icon className="h-4 w-4" />
          {item.name}
        </Link>
      ))}
    </>
  );
}
