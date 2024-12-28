"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { CreditCard, Edit, Edit2, Trash2 } from "lucide-react";
import ConfirmDeleteModal from "@/app/(dialog)/delete/page";

const InfoPaiementPage = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const router = useRouter();
  const [moyenPaiement, setMoyenPaiement] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

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
        setMoyenPaiement(data);
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

  const handleAddPayment = () => {
    router.push("/personnel/InfoPaiement/addPaiement");
  };

  const handleEditClick = (id) => {
    console.log("Éditer moyen de paiement avec ID :", id);
    router.push(`/personnel/InfoPaiement/editinfo/id=${id}`);
  };

  const handleDeleteClick = (id) => {
    console.log("Supprimer moyen de paiement avec ID :", id);
    setSelectedPaymentId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPaymentId) return;

    try {
      const response = await fetch(`/api/infopaiement/${selectedPaymentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression des données");
      }

      setMoyenPaiement((prevMoyenPaiement) => {
        return prevMoyenPaiement.filter(
          (paiement) => paiement.id !== selectedPaymentId
        );
      });

      console.log("Données supprimées");
    } catch (error) {
      console.error("Erreur lors de la suppression des données :", error);
    } finally {
      setShowDeleteModal(false);
      setSelectedPaymentId(null);
    }
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
  };

  const formatCardExpiry = (expiryDate) => {
    if (!expiryDate) return "";
    if (expiryDate.includes("T")) {
      const date = new Date(expiryDate);
      if (isNaN(date)) return expiryDate;
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = String(date.getFullYear()).slice(-2);
      return `${month}/${year}`;
    }
    const parts = expiryDate.split("/");
    if (parts.length < 2) return expiryDate;
    const [month, year] = parts;
    return `${month}/${year.slice(-2)}`;
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Mes Moyens de Paiement
      </h1>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }, (_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="p-0">
                <Skeleton className="h-48 w-full" />
              </CardHeader>
              <CardContent className="mt-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {moyenPaiement.map((paiement) => (
            <Card
              key={paiement.id}
              className="overflow-hidden hover:bg-accent transition-colors duration-300"
            >
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">
                    <CreditCard className="mr-2 h-20 w-20" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-gray-800 mt-auto">
                      **** **** **** {paiement.cardNumber.slice(-4)}
                    </p>
                    <p className="text-base font-semibold text-muted-foreground">
                      Titulaire : {paiement.nameOnCard}
                    </p>
                    <p className="text-base font-semibold text-muted-foreground mt-2">
                      Expiration : {formatCardExpiry(paiement.cardExpiry)}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-5">
                  <button
                    onClick={() => handleEditClick(paiement.id)}
                    className="text-yellow-500 hover:text-yellow-700 transition-colors"
                    title="Éditer"
                  >
                    <Edit className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(paiement.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="h-6 w-6" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button
            onClick={handleAddPayment}
            className="w-full py-6 text-lg"
            variant="outline"
          >
            <CreditCard className="mr-2 h-5 w-5" /> Ajouter un moyen de paiement
          </Button>
        </div>
      )}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
        theme="light"
      />
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={handleCloseModal}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default InfoPaiementPage;
