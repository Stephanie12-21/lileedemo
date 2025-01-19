"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Eye,
  Edit,
  Trash2,
  Rocket,
  Plus,
  Loader,
  BadgeCheck,
  Search,
  ChevronDown,
  BadgeAlert,
  CreditCard,
  Wallet,
  CheckCircle,
  Asterisk,
} from "lucide-react";
import ConfirmDeleteModal from "@/app/(dialog)/delete/page";

import { SuccessModal } from "@/app/(dialog)/success/SuccessModal";
import { ErrorModal } from "@/app/(dialog)/error/ErrorModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AnimatePresence, motion } from "framer-motion";

const Annonces = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAnnonceId, setSelectedAnnonceId] = useState(null);
  const { data: session, status } = useSession();
  const [annonces, setAnnonces] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const fetchAnnonces = async (userId) => {
    try {
      const response = await fetch(`/api/annonce?userId=${userId}`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des annonces");
      }
      const data = await response.json();
      setAnnonces(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des annonces :", error);
      setError("Erreur lors de la récupération des annonces.");
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchAnnonces(session.user.id);
    }
  }, [session]);

  const handleDeleteClick = (id) => {
    setSelectedAnnonceId(id);
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setSelectedAnnonceId(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedAnnonceId) return;

    try {
      const response = await fetch(`/api/annonce/${selectedAnnonceId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'annonce");
      }

      setAnnonces((prevAnnonces) =>
        prevAnnonces.filter((annonce) => annonce.id !== selectedAnnonceId)
      );
      console.log("Annonce supprimée avec succès");
      setIsSuccessModalOpen(true);
      setTimeout(() => {
        router.push("/admin/annonces");
      }, 2000);
    } catch (error) {
      setIsErrorModalOpen(true);
      console.error("Erreur lors de la suppression des données :", error);
    } finally {
      setShowDeleteModal(false);
      setSelectedAnnonceId(null);
    }
  };

  const steps = [
    {
      icon: CreditCard,
      title: "Gérer votre profil connecté à stripe",
      content:
        "Afin de sécuriser les transcations effectuées sur la plate-forme Lilee, nous vous recommandons fermement de connecter votre email à un compte stripe. Ceci est fait dans le but de faciliter et garantir le bon déroulement des transactions. Sans cette connexion, il sera impossible de procéder à des transactions.",
    },
    {
      icon: Wallet,
      title: "Configurer vos informations bancaires",
      content:
        "Pour cette étape, vous devrez aller dans la page de votre profil utilisateur. Cliquez sur le bouton  GENERER LE LIEN DE CONNEXION A STRIPE , attendez quelques instants pour que le bouton CONNECTER LE COMPTE A STRIPE apparaisse. Vous allez donc appuyer sur ce boutoon là afin d'être redirigé vers une page où vous pourrez compléter les informations nécessaires",
    },
    {
      icon: CheckCircle,
      title: "Finaliser votre configuration",
      content:
        "La dernière étape consiste à fournir vos informations adminles et bancaires et valider l'ensemble des informations. Une fois cette étape complétée, vous pourrez commencer à recevoir des paiements en toute sécurité.",
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
  const filteredAnnonces = annonces.filter(
    (annonce) =>
      annonce.titre.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory ? annonce.categorieAnnonce === selectedCategory : true)
  );

  const categories = [
    { value: "", label: "Toutes les catégories" },
    { value: "IMMOBILIER", label: "Immobilier" },
    { value: "VETEMENT", label: "Vêtement" },
    { value: "EMPLOI", label: "Emploi et recrutements" },
    { value: "SERVICE", label: "Services" },
    { value: "VOITURE", label: "Voitures" },
    { value: "LOISIR", label: "Loisir" },
    { value: "MATERIEL", label: "Matériels et équipements" },
    { value: "MOBILIER", label: "Mobilier" },
    { value: "DONS", label: "Dons" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 justify-between mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full max-w-full mx-auto p-0">
          <div className="flex items-center relative w-full md:w-2/3 space-x-2">
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
                                index === currentStep
                                  ? "bg-primary"
                                  : "bg-gray-300"
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

            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher une annonce"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-2 border-primary/20 focus:border-primary transition-colors"
              />
            </div>

            {/* Bouton pour ouvrir le dialog */}
          </div>
          <div className="relative w-full md:w-1/3">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-2 text-left bg-white border-2 border-primary/20 rounded-md focus:outline-none focus:border-primary transition-colors"
            >
              <span className="truncate">
                {selectedCategory
                  ? categories.find((cat) => cat.value === selectedCategory)
                      ?.label
                  : "Toutes les catégories"}
              </span>
              <ChevronDown
                className={`ml-2 h-4 w-4 transition-transform duration-200 ${
                  isDropdownOpen ? "transform rotate-180" : ""
                }`}
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    className="w-full text-left px-4 py-2 hover:bg-primary/10 focus:bg-primary/10 focus:outline-none transition-colors"
                    onClick={() => {
                      setSelectedCategory(category.value);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <Link href="/admin/annonces/addAnnonce">
          <Button className="w-full md:w-auto">
            Créer une nouvelle annonce
          </Button>
        </Link>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
          role="alert"
        >
          <strong className="font-bold">Erreur!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAnnonces.length === 0 ? (
          <p className="text-center col-span-full text-gray-500">
            Aucune annonce trouvée.
          </p>
        ) : (
          filteredAnnonces.map((annonce) => (
            <Card
              key={annonce.id}
              className="overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-xl flex flex-col"
            >
              <CardContent className="p-0">
                {annonce.imageAnnonces.length > 0 && (
                  <div className="relative h-48">
                    <Image
                      src={annonce.imageAnnonces[0].path}
                      alt={annonce.titre}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 ease-in-out hover:scale-105"
                    />
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex flex-col p-4 h-full">
                <div className="w-full">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="mb-2">
                      {annonce.categorieAnnonce}
                    </Badge>
                    {annonce.statut.toUpperCase() === "PUBLIEE" ? (
                      <BadgeCheck
                        className="h-7 w-7 text-green-500"
                        title="Publiée"
                      />
                    ) : annonce.statut.toUpperCase() ===
                      "EN_ATTENTE_DE_VALIDATION" ? (
                      <Loader
                        className="h-7 w-7 text-yellow-500 animate-spin"
                        title="En attente de validation"
                      />
                    ) : (
                      <BadgeAlert
                        className="h-7 w-7 text-red-500"
                        title="Désactivée"
                      />
                    )}
                  </div>

                  <h3 className="text-xl font-semibold line-clamp-2">
                    {annonce.titre}
                  </h3>

                  <p className="text-base text-muted-foreground mb-1">
                    {new Date(annonce.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex justify-between items-center w-full pt-8 mt-auto">
                  <Link
                    href={`/admin/annonces/id=${annonce.id}`}
                    className="text-green-500 hover:text-green-700 transition-colors"
                    title="Voir"
                  >
                    <Eye className="h-6 w-6" />
                  </Link>
                  <Link
                    href={`/admin/annonces/editAnnonce/id=${annonce.id}`}
                    className="text-yellow-500 hover:text-yellow-700 transition-colors"
                    title="Éditer"
                  >
                    <Edit className="h-6 w-6" />
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(annonce.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="h-6 w-6" />
                  </button>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
      />
    </div>
  );
};

export default Annonces;
