import Link from "next/link";
import React from "react";

const Divers = () => {
  const links = [
    { href: "/Blog", label: "Blog & presse" },
    { href: "/Contact", label: "Nous contacter" },
    {
      href: "/Politique_de_confidentialites",
      label: "Politique de confidentialité",
    },
    { href: "/Conditions_generales", label: "Conditions générales" },
  ];

  return (
    <div className="flex flex-col justify-between items-start space-y-2">
      <h1 className="font-bold text-[30px] text-white">Divers</h1>
      {links.map((link, index) => (
        <Link
          key={index}
          href={link.href}
          className="font-semibold text-[16px] text-white hover:underline"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
};

export default Divers;
