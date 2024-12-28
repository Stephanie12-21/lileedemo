"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CreditCard, Calendar, Lock } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const AddPayment = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardExpiry: "",
    cardCVC: "",
    nameOnCard: "",
  });
  const [error, setError] = useState("");
  const { data: session } = useSession();

  if (!session) {
    router.push("/login");
    return null;
  }

  const userId = session.user.id;

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);

    const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 ");

    setFormData((prev) => ({ ...prev, cardNumber: formattedValue }));
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    // Valider uniquement si la date d'expiration change
    if (id === "cardExpiry") {
      validateExpiryDate(value);
    }
  };

  const validateExpiryDate = (expiry) => {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!regex.test(expiry)) {
      setError("Veuillez entrer la date au format MM/AA");
      return false;
    }

    const [month, year] = expiry.split("/").map((part) => parseInt(part, 10));

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear() % 100;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      setError("La date d'expiration est antérieure à la date actuelle.");
      return false;
    }

    setError("");
    return true;
  };

  const validateCVC = (cvc) => {
    const isValid = /^\d{3}$/.test(cvc);
    if (!isValid) {
      setError("Le CVC doit contenir exactement 3 chiffres.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rawCardNumber = formData.cardNumber.replace(/\s/g, "");

    if (rawCardNumber.length !== 16) {
      setError("Le numéro de carte doit contenir exactement 16 chiffres.");
      return;
    }

    if (!validateExpiryDate(formData.cardExpiry)) {
      return;
    }

    if (!validateCVC(formData.cardCVC)) {
      return;
    }

    setError("");

    try {
      const response = await fetch("/api/infopaiement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          cardNumber: rawCardNumber,
          cardExpiry: formData.cardExpiry,
          cardCVC: formData.cardCVC,
          nameOnCard: formData.nameOnCard,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setError("");
        toast.success("Moyen de paiement ajouté avec succès !", {
          onClose: () => {
            router.push(`/personnel/InfoPaiement/`);
            setFormData({
              cardNumber: "",
              cardExpiry: "",
              cardCVC: "",
              nameOnCard: "",
            });
          },
        });
      } else {
        setError(
          data.message ||
            "Erreur inconnue lors de l'ajout du moyen de paiement."
        );
      }
    } catch (error) {
      setError("Erreur lors de la soumission de la carte.");
      console.error("Erreur de requête API:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card className="w-full max-w-md mx-auto p-5">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Informations de paiement</CardTitle>
            <CardDescription>
              Entrez les détails de votre carte de crédit
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="space-y-2">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="cardNumber">Numéro de carte</Label>
                  <div className="relative">
                    <Input
                      id="cardNumber"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                      required
                    />
                    <CreditCard
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="nameOnCard">Nom marqué sur la carte</Label>
                  <div className="relative">
                    <Input
                      id="nameOnCard"
                      type="text"
                      placeholder="John Doe"
                      value={formData.nameOnCard}
                      onChange={(e) =>
                        setFormData({ ...formData, nameOnCard: e.target.value })
                      }
                      maxLength={19}
                      required
                    />
                    <CreditCard
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cardExpiry">Date d&apos;expiration</Label>
                <div className="relative">
                  <Input
                    id="cardExpiry"
                    type="text"
                    placeholder="MM/AA"
                    value={formData.cardExpiry}
                    onChange={handleChange}
                    required
                    pattern="^(0[1-9]|1[0-2])\/\d{2}$"
                    title="Veuillez entrer la date au format MM/AA"
                  />
                  <Calendar
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardCVC">CVC</Label>
                <div className="relative">
                  <Input
                    id="cardCVC"
                    type="text"
                    placeholder="123"
                    value={formData.cardCVC}
                    onChange={(e) => {
                      handleChange(e);
                      validateCVC(e.target.value);
                    }}
                    required
                    maxLength={3}
                    pattern="^\d{3}$"
                    title="Le CVC doit contenir exactement 3 chiffres."
                  />
                  <Lock
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Ajouter
            </Button>
          </CardFooter>
        </form>
      </Card>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
    </div>
  );
};

export default AddPayment;
