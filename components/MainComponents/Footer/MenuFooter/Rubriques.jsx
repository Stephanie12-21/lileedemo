import React from "react";

const Rubriques = () => {
  const rubriques = [
    "Immobilier",
    "Emplois",
    "Voitures",
    "Matériels",
    "Dons",
    "Loisirs",
    "Vêtements",
  ];

  return (
    <div className="flex flex-col justify-between items-start space-y-2">
      <h1 className="font-bold text-[30px] text-white">Rubriques</h1>
      {rubriques.map((rubrique, index) => (
        <p key={index} className="font-semibold text-[16px] text-white">
          {rubrique}
        </p>
      ))}
    </div>
  );
};

export default Rubriques;
