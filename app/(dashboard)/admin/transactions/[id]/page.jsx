"use client";

import AnimatedSymbol from "@/components/MainComponents/Sections/Loading/AnimatedSymbol";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Link } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const InfoAnnonces = ({ params }) => {
  const router = useRouter();
  const { id } = params;
  const { data: session } = useSession();
  const [transaction, setTransaction] = useState(null);
  const [annonceId, setAnnonceId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buyerFacturation, setBuyerFacturation] = useState(null);
  const [sellerFacturation, setSellerFacturation] = useState(null);
  const [buyerData, setBuyerData] = useState(null);
  const [buyerDataName, setBuyerDataName] = useState(null);
  const [buyerDataEmail, setBuyerDataEmail] = useState(null);
  const [buyerDataPhone, setBuyerDataPhone] = useState(null);
  const [sellerData, setSellerData] = useState(null);
  const [sellerDataName, setSellerDataName] = useState(null);
  const [sellerDataEmail, setSellerDataEmail] = useState(null);
  const [sellerDataPhone, setSellerDataPhone] = useState(null);
  const [buyerId, setBuyerId] = useState(null);
  const [sellerId, setSellerId] = useState(null);

  useEffect(() => {
    if (!session) {
      router.push("/login");
    }
  }, [session, router]);

  useEffect(() => {
    const fetchTransaction = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const res = await fetch(`/api/transactions/${id}`);
        const data = await res.json();

        if (data) {
          setTransaction(data);
          setBuyerId(data.buyerUserId);
          setSellerId(data.annonceUserId);
          setAnnonceId(data.annonceId);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de la transaction:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);

  useEffect(() => {
    const fetchSellerFacturation = async () => {
      if (!sellerId) return;
      try {
        const response = await fetch(`/api/facturation?userid=${sellerId}`);
        if (!response.ok) {
          throw new Error(
            "Erreur lors de la récupération de l'adresse de facturation du vendeur."
          );
        }

        const data = await response.json();

        setSellerFacturation(data.adresseFacturation[0] || null);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données du vendeur:",
          error
        );
      }
    };

    if (sellerId) {
      fetchSellerFacturation();
    }
  }, [sellerId]);

  useEffect(() => {
    const fetchBuyerFacturation = async () => {
      if (!buyerId) return;
      try {
        const response = await fetch(`/api/facturation?userid=${buyerId}`);
        if (!response.ok) {
          throw new Error(
            "Erreur lors de la récupération de l'adresse de facturation de l'acheteur."
          );
        }

        const data = await response.json();
        setBuyerFacturation(data.adresseFacturation[0] || null);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données de l'acheteur:",
          error
        );
      }
    };

    if (buyerId) {
      fetchBuyerFacturation();
    }
  }, [buyerId]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!buyerId) return;
      try {
        const response = await fetch(`/api/user/${buyerId}`);
        if (!response.ok) {
          throw new Error(
            "Erreur lors de la récupération des données de l'acheteur."
          );
        }
        const data = await response.json();
        setBuyerData(data.user);
        setBuyerDataName(`${data.user.prenom} ${data.user.nom}`);
        setBuyerDataEmail(data.user.email);
        setBuyerDataPhone(data.user.phone);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données de l'acheteur:",
          error
        );
      }
    };
    if (buyerId) {
      fetchUserData();
    }
  }, [buyerId]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!sellerId) return;
      try {
        const response = await fetch(`/api/user/${sellerId}`);
        if (!response.ok) {
          throw new Error(
            "Erreur lors de la récupération des données du vendeur."
          );
        }
        const data = await response.json();
        setSellerData(data);
        setSellerDataName(`${data.user.prenom} ${data.user.nom}`);
        setSellerDataEmail(data.user.email);
        setSellerDataPhone(data.user.phone);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données du vendeur:",
          error
        );
      }
    };
    if (sellerId) {
      fetchUserData();
    }
  }, [sellerId]);

  if (loading) {
    return (
      <div>
        <AnimatedSymbol />
      </div>
    );
  }

  if (!transaction) {
    return <p>Transaction non trouvée.</p>;
  }

  const { transactionStatus: status, transactionDate, dateRange } = transaction;

  const formatStatus = (status) => {
    switch (status) {
      case "COMPLETED":
        return "Succès";
      case "FAILED":
        return "Échec";
      case "PENDING":
        return "En attente";
      default:
        return status;
    }
  };

  const transactionRef = (() => {
    const [day, month, year] = transactionDate.split("/");
    const formattedDate = `${day}${month}${year}`;
    return `REF${formattedDate}-${id}`;
  })();

  const handleSeeAnnonce = () => {
    router.push(`/Annonces/id=${annonceId}`);
  };
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="flex justify-between items-center bg-primary p-6 rounded-t-xl">
          <h1 className="text-3xl font-semibold text-white">
            {transactionRef}
          </h1>
          <Badge
            variant="secondary"
            className="text-lg py-2 px-4 bg-gray-200 rounded-lg"
          >
            {formatStatus(status)}
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-8 p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">
              Le vendeur :{" "}
              <span className="text-primary">{sellerDataName}</span>
            </h2>
            {sellerFacturation ? (
              <div className="space-y-2 text-gray-600">
                <p>
                  <span className="font-semibold">Nom :</span>{" "}
                  {sellerFacturation.nom}
                </p>
                <p>
                  <span className="font-semibold">Email :</span>{" "}
                  {sellerDataEmail}
                </p>
                <p>
                  <span className="font-semibold">Numéro de téléphone :</span>{" "}
                  {sellerDataPhone}
                </p>
                <p>
                  <span className="font-semibold">Adresse :</span>{" "}
                  {sellerFacturation.adresse}
                </p>
                <p>
                  <span className="font-semibold">Code postal :</span>{" "}
                  {sellerFacturation.codePostal}
                </p>
                <p>
                  <span className="font-semibold">Ville :</span>{" "}
                  {sellerFacturation.ville}
                </p>
                <p>
                  <span className="font-semibold">Pays :</span>{" "}
                  {sellerFacturation.pays}
                </p>
              </div>
            ) : (
              <p className="italic text-gray-400">Chargement...</p>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">
              L&apos;acheteur :{" "}
              <span className="text-primary">{buyerDataName}</span>
            </h2>
            {buyerFacturation ? (
              <div className="space-y-2 text-gray-600">
                <p>
                  <span className="font-semibold">Nom :</span>{" "}
                  {buyerFacturation.nom}
                </p>
                <p>
                  <span className="font-semibold">Email :</span>{" "}
                  {buyerDataEmail}
                </p>
                <p>
                  <span className="font-semibold">Numéro de téléphone :</span>{" "}
                  {buyerDataPhone}
                </p>
                <p>
                  <span className="font-semibold">Adresse :</span>{" "}
                  {buyerFacturation.adresse}
                </p>
                <p>
                  <span className="font-semibold">Code postal :</span>{" "}
                  {buyerFacturation.codePostal}
                </p>
                <p>
                  <span className="font-semibold">Ville :</span>{" "}
                  {buyerFacturation.ville}
                </p>
                <p>
                  <span className="font-semibold">Pays :</span>{" "}
                  {buyerFacturation.pays}
                </p>
              </div>
            ) : (
              <p className="italic text-gray-400">Chargement...</p>
            )}
          </div>
        </div>

        {dateRange && dateRange !== "Aucune date" && (
          <div className="bg-gray-100 p-6 rounded-b-xl">
            <h2 className="text-xl font-bold text-gray-800">
              Durée de réservation :
            </h2>
            <p className="text-gray-600">{dateRange}</p>
          </div>
        )}
      </div>
      <div className="bg-gray-100 p-6 rounded-b-xl">
        <Button
          variant="default"
          onClick={handleSeeAnnonce}
          size="lg"
          className="group transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Voir l&apos;annonce
          <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
};

export default InfoAnnonces;
