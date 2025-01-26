"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Asterisk,
  Building,
  CheckCircle,
  CreditCard,
  Edit,
  Globe,
  Home,
  MapPin,
  Trash2,
  User,
  Wallet,
} from "lucide-react";
import ConfirmDeleteModal from "@/app/(dialog)/delete/page";
import { SuccessModal } from "@/app/(dialog)/success/SuccessModal";
import { ErrorModal } from "@/app/(dialog)/error/ErrorModal";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";

const Facturation = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [facturationData, setFacturationData] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const { data: session, status } = useSession();
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const fetchAnnonces = async (userId) => {
    try {
      const response = await fetch(`/api/facturation?userid=${userId}`);
      if (!response.ok) {
        throw new Error(
          "Erreur lors de la récupération des adresses de facturation."
        );
      }

      const data = await response.json();
      const facturations = data.adresseFacturation || [];
      if (facturations.length > 0) {
        setFacturationData(facturations);
      } else {
        setError("Aucune donnée de facturation trouvée.");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      setError("Impossible de récupérer les adresses de facturation.");
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchAnnonces(session.user.id);
    }
  }, [session]);

  const steps = [
    {
      icon: CreditCard,
      title: "Gérer votre profil connecté à stripe",
      content:
        "Afin de sécuriser les transactions effectuées sur la plate-forme Lilee, nous vous recommandons fermement de connecter votre email à un compte stripe. Ceci est fait dans le but de faciliter et garantir le bon déroulement des transactions. Sans cette connexion, il sera impossible de procéder à des transactions.",
    },
    {
      icon: Wallet,
      title: "Configurer vos informations bancaires",
      content:
        "Pour cette étape, vous devrez aller dans la page de votre profil utilisateur. Cliquez sur le bouton 'Générer le lien de connexion à Stripe', attendez quelques instants pour que le bouton 'Connecter le compte à Stripe' apparaisse. Vous allez donc appuyer sur ce bouton pour être redirigé vers une page où vous pourrez compléter les informations nécessaires.",
    },
    {
      icon: CheckCircle,
      title: "Finaliser votre configuration",
      content:
        "La dernière étape consiste à fournir vos informations personnelles et bancaires et valider l'ensemble des informations. Une fois cette étape complétée, vous pourrez commencer à recevoir des paiements en toute sécurité.",
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onEdit = () => {
    router.push("/personnel/facturation/edit");
  };

  const onDelete = () => {
    setShowDeleteModal(true);
  };

  const FacturationCard = ({ facturation }) => {
    const { adresse, codePostal, ville, pays, nom } = facturation;
    const facturationDetails = [
      { icon: Home, label: "Adresse", value: adresse },
      { icon: MapPin, label: "Code Postal", value: codePostal },
      { icon: Building, label: "Ville", value: ville },
      { icon: Globe, label: "Pays", value: pays },
      { icon: User, label: "Pays", value: nom },
    ];

    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Informations de facturation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {facturationDetails.map((item, index) => (
              <div key={index} className="flex items-center space-x-4 p-2">
                {React.createElement(item.icon, { className: "h-6 w-6" })}
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {item.label}
                  </p>
                  <p className="text-lg font-semibold">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <Button variant="outline" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <Dialog>
          <DialogTrigger asChild>
            <button
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:ring-4 focus:ring-offset-2 focus:ring-yellow-400 transition-all duration-200 transform hover:scale-105"
              aria-label="Ajouter une annonce"
            >
              <Asterisk className="w-6 h-6 animate-spin" />
            </button>
          </DialogTrigger>

          <DialogContent>
            <div>
              <div className="transition-transform hover:scale-105">
                <div className="flex flex-col items-center p-6 relative min-h-[400px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center"
                    >
                      <div className="mb-4 text-primary">
                        {React.createElement(steps[currentStep].icon, {
                          size: 48,
                        })}
                      </div>
                      <h3 className="font-semibold text-lg text-center mb-2">
                        {steps[currentStep].title}
                      </h3>
                      <p className="text-base text-gray-900 text-center mb-8">
                        {steps[currentStep].content}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  <div className="flex justify-between w-full mt-8">
                    <Button
                      onClick={handlePrev}
                      disabled={currentStep === 0}
                      variant="outline"
                    >
                      Étape précédente
                    </Button>
                    <div className="flex gap-2">
                      {steps.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index === currentStep ? "bg-primary" : "bg-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <Button
                      onClick={handleNext}
                      disabled={currentStep === steps.length - 1}
                    >
                      Prochaine étape
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Button onClick={() => router.push("/personnel/facturation/add")}>
          Créer une nouvelle adresse
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          <strong>Erreur :</strong> {error}
        </div>
      )}

      {facturationData.length > 0 ? (
        facturationData.map((facturation, index) => (
          <FacturationCard key={index} facturation={facturation} />
        ))
      ) : (
        <p>Aucune adresse de facturation disponible.</p>
      )}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {}}
      />
      <SuccessModal isOpen={false} onClose={() => {}} />
      <ErrorModal isOpen={false} onClose={() => {}} />
    </div>
  );
};

export default Facturation;
