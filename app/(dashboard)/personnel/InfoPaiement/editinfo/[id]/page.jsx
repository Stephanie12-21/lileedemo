"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const EditInfoPaiement = ({ params }) => {
  const { id } = params;
  const [moyenpaiement, setMoyenpaiement] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const numericId = (() => {
    try {
      const decodedId = decodeURIComponent(id);
      const extractedId = decodedId.split("=")[1];
      if (!extractedId || isNaN(extractedId)) throw new Error("ID invalide");
      return extractedId;
    } catch (err) {
      console.error("Erreur lors du traitement de l'ID :", err);
      return null;
    }
  })();

  useEffect(() => {
    const fetchMoyenPaiement = async (userId) => {
      try {
        const response = await fetch(`/api/infopaiement/${userId}`, {
          headers: { userId },
        });
        if (!response.ok) {
          throw new Error(
            "Erreur lors de la récupération des moyens de paiement"
          );
        }
        const data = await response.json();
        setMoyenpaiement(data);
      } catch (error) {
        toast.error(`Erreur : ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchMoyenPaiement(session.user.id);
    } else {
      setLoading(false);
      toast.info("Impossible de récupérer l'ID de l'utilisateur.");
    }
  }, [session]);

  return (
    <div>
      <p>id reçu : {numericId}</p>
    </div>
  );
};

export default EditInfoPaiement;
