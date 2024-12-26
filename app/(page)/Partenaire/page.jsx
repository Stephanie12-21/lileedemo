// export default Partenaires;
"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import jsPDF from "jspdf";

const Partenaires = () => {
  const [logoBase64, setLogoBase64] = useState("");

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const response = await fetch("/assets/logo.svg");
        if (!response.ok) {
          throw new Error(
            `Erreur lors du chargement du logo : ${response.statusText}`
          );
        }

        const svgText = await response.text();
        const base64 = `data:image/svg+xml;base64,${btoa(svgText)}`;
        setLogoBase64(base64);
        console.log("Logo chargé avec succès :", base64);
      } catch (error) {
        console.error("Erreur lors du chargement du logo :", error);
      }
    };

    loadLogo();
  }, []);

  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const generatePDFs = () => {
    generateListPDF();
    generateContractPDF();
  };

  const generateListPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const marginLeft = 20;
    const marginRight = 20;
    const contentWidth = pageWidth - marginLeft - marginRight;
    let currentY = 20;

    const addText = (text, fontSize = 12, isBold = false) => {
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      const lines = doc.splitTextToSize(text, contentWidth);
      doc.text(lines, marginLeft, currentY);
      currentY += lines.length * fontSize * 0.5 + 5;
    };

    // Header
    doc.setFillColor(21, 33, 61); // Couleur du header
    doc.rect(0, 0, pageWidth, 40, "F");

    if (logoBase64) {
      doc.addImage(logoBase64, "SVG", marginLeft, 5, 30, 30); // Utilisation du logo SVG
    }

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("Liste des pièces à fournir", 60, 25);

    // Contenu
    doc.setTextColor(0, 0, 0);
    currentY = 50;

    addText("lilee.com, Mr Marc Denneval", 14, true);
    addText("22 bis rue du Calabrun");
    addText("0787308386");
    addText("entrehandi@gmail.com");

    currentY += 10;
    addText("Pièces à fournir :", 14, true);

    const items = [
      "Logo de votre entreprise",
      "Coordonnées de l'entreprise :",
      "  - Nom",
      "  - Adresse",
      "  - Numéro de téléphone",
      "  - Adresse mail",
      "  - Liens vers le site internet (s'il y a)",
      "  - Liens vers les réseaux sociaux (s'il y a)",
      "Si vous le souhaitez, un court article présentant votre entreprise.",
      "Pour la mise en avant de vos offres promotionnelles ou nouveautés, pensez à nous envoyer des photos, des tarifs et toutes autres informations.",
    ];

    items.forEach((item) => addText(item));

    currentY += 10;
    addText(
      "Merci de nous envoyer par mail les documents nécessaires !",
      14,
      true
    );

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(
      "© 2023 Lilee - Tous droits réservés",
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      {
        align: "center",
      }
    );

    doc.save("Liste-des-pieces-a-fournir-pour-la-publicite-sur-Lilee.pdf");
  };

  const generateContractPDF = () => {};

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      className="w-full"
    >
      <div className="flex flex-col items-center mt-20 px-4 mb-9">
        <motion.p
          variants={itemVariants}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-4 text-center"
        >
          <h1 className="text-4xl font-bold text-[#15213d] text-center mb-10">
            Rejoignez-nous
          </h1>
        </motion.p>

        <motion.p
          variants={itemVariants}
          transition={{ duration: 0.5 }}
          className="text-center text-lg leading-relaxed max-w-2xl mb-6"
        >
          Ne manquez pas cette opportunité unique de mettre en lumière votre
          engagement et d&apos;accroître votre visibilité grâce à Lilee.
          Contactez-nous dès aujourd&apos;hui pour bénéficier de nos offres de
          lancement et rejoindre notre communauté d&apos;entreprises engagées.
        </motion.p>

        <motion.div
          variants={itemVariants}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-lg"
        >
          <Button
            onClick={generatePDFs}
            className="px-20 py-3 bg-[#15213d] text-white text-base rounded-lg"
          >
            Devenir partenaire de Lilee
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Partenaires;
