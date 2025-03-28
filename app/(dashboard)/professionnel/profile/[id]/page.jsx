"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ImagePlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimatedSymbol from "@/components/MainComponents/Sections/Loading/AnimatedSymbol";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const UserProfilePreview = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [siretValid, setSiretValid] = useState(null);
  const router = useRouter();
  const { id: userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [companyInfo, setCompanyInfo] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [secteurActivite, setSecteurActivite] = useState(null);
  const [typeSociete, setTypeSociete] = useState(null);
  const [imageDetails, setImageDetails] = useState(null);
  const [showVerifInfo, setShowVerifInfo] = useState(false);
  const [editedUser, setEditedUser] = useState({
    nom: "",
    prenom: "",
    email: "",
    phone: "",
  });
  const [editedCompany, setEditedCompany] = useState({
    companyId: "",
    nomSociete: "",
    siret: "",
    codePostal: "",
    ville: "",
    secteurActivite: "", // Valeur par défaut
    typeSociete: "", // Valeur par défaut
  });

  //  <--
  const [profileLink, setProfileLink] = useState("");
  const generateProfileLink = async () => {
    const formData = new FormData();
    formData.append("userId", session?.user.id);
    const response = await fetch("/api/stripe/account_link", {
      method: "POST",
      body: formData,
    });

    const accountLink = await response.json();
    setProfileLink(accountLink.url);
  };

  // ->
  //récupérer les données depuis le server
  const fetchUserData = useCallback(async () => {
    setLoading(true); // Démarrer le chargement au début de la fonction
    try {
      const response = await fetch(`/api/userPro/${userId}`);
      if (!response.ok) {
        throw new Error(
          "Erreur lors de la récupération des données utilisateur."
        );
      }
      const data = await response.json();

      // Afficher les données dans la console pour vérification
      console.log("Données récupérées de l'API :", data);

      // Vérification que 'data.user' existe avant d'accéder à ses propriétés
      if (!data.user) {
        throw new Error("Aucune donnée utilisateur trouvée.");
      }

      setUser(data.user);
      setProfileImage(
        data.user.profileImages[0]?.path || "Aucune image relative à ce compte"
      );

      // Assurez-vous que tous les champs existent avant de les utiliser
      setEditedUser({
        nom: data.user.nom || "",
        prenom: data.user.prenom || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
        nomSociete: data.user.company?.nomSociete || "",
        ville: data.user.company?.ville || "",
        siret: data.user.company?.siret || "",
        typeSociete: data.user.company?.typeSociete || "",
        codePostal: data.user.company?.codePostal || "",
        companyId: data.user.company?.id || "",
        secteurActivite: data.user.company?.secteurActivite || "",
      });
    } catch (error) {
      setError(
        error.message ||
          "Une erreur est survenue lors du chargement des données."
      );
    } finally {
      setLoading(false); // Assurez-vous que le chargement est désactivé à la fin
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId, fetchUserData]);

  ////////////////////////////FONCTION POUR LES MODIFICATIONS DE L'ADMIN DU COMPTE////////////////////

  const handleEditClick = async () => {
    if (isEditing) {
      const generatedCodes = generateVerificationCodes();
      setVerificationCodes(generatedCodes);

      try {
        const response = await fetch("/api/user/emailVerif/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: editedUser.email,
            prenom: editedUser.prenom,
            verificationCode: generatedCodes.email,
          }),
        });

        if (!response.ok) {
          throw new Error("Erreur lors de l'envoi de l'e-mail");
        }
        console.log("E-mail envoyé avec succès");
        setShowVerifInfo(true);
      } catch (error) {
        console.error(error);
        alert(error.message);
        return;
      }

      // const phone = `+${editedUser.phone}`;
      // try {
      //   const response = await fetch("/api/user/verifPhone/", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       Phone: phone,
      //       prenom: editedUser.prenom,
      //       verificationCode: generatedCodes.phone,
      //     }),
      //   });

      //   if (!response.ok) {
      //     throw new Error("Erreur lors de l'envoi du SMS");
      //   }
      //   console.log("SMS envoyé avec succès");
      //   console.log(
      //     "Code de vérification envoyé par SMS:",
      //     generatedCodes.phone
      //   );
      //   setShowVerifInfo(true);
      // } catch (error) {
      //   console.error(error);
      //   alert(error.message);
      //   return;
      // }
    } else {
      setIsEditing(true);
    }
  };

  const [verificationCodes, setVerificationCodes] = useState({
    email: "",
    phone: "",
  });

  const generateVerificationCodes = () => {
    const emailVerificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    // const phoneVerificationCode = Math.floor(
    //   100000 + Math.random() * 900000
    // ).toString();
    return { email: emailVerificationCode };
  };

  const handleVerifyCodes = (enteredEmailCode) => {
    if (
      enteredEmailCode === verificationCodes.email
      // &&
      // enteredPhoneCode === verificationCodes.phone
    ) {
      handleConfirmEdit();
    } else {
      alert(
        "Les codes de vérification ne correspondent pas. Veuillez réessayer."
      );
    }
    setShowVerifInfo(false);
  };

  const handleConfirmEdit = async () => {
    const formData = new FormData();
    formData.append("nom", editedUser.nom);
    formData.append("prenom", editedUser.prenom);
    formData.append("email", editedUser.email);
    formData.append("phone", editedUser.phone);

    if (imageDetails) {
      formData.append("image", imageDetails);
    }

    try {
      const response = await fetch(`/api/userPro/${userId}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Échec de la mise à jour du profil utilisateur");
      }

      await fetchUserData();
      setIsEditing(false);
      toast.success("Profil mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil :", error);
      alert("Erreur lors de la mise à jour du profil. Veuillez réessayer.");
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setEditedUser((prevState) => ({
      ...prevState,
      [id]: value,
    }));
    setEditedCompany((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleCancelEdit = () => {
    setShowVerifInfo(false);
  };

  const handleDeleteClick = async () => {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer l'article avec l'ID : ${userId}?`
    );
    if (confirmed) {
      try {
        const response = await fetch(`/api/userPro/${userId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          toast.success("L'utilisateur a été supprimé avec succès.");
        } else {
          throw new Error("Erreur lors de la suppression de l'user.");
        }
      } catch (error) {
        alert("Erreur lors de la suppression de l'user.");
        console.error("Erreur lors de la suppression de l'user :", error);
      }
    }
  };
  ////////////////////////////FONCTION POUR LES MODIFICATIONS DE L'ADMIN DU COMPTE////////////////////

  ////////////////////////////FONCTION POUR LES MODIFICATIONS DE LA SOCIETE////////////////////

  const verifySiret = async () => {
    const sanitizedSiret = editedCompany.siret.replace(/\s/g, "");

    if (!/^\d{14}$/.test(sanitizedSiret)) {
      console.error(
        "Erreur : Le numéro de SIRET doit contenir exactement 14 chiffres."
      );
      setErrorMessage(
        "Le numéro de SIRET doit contenir exactement 14 chiffres."
      );
      setSiretValid(false);
      return;
    }

    try {
      const response = await fetch(
        `https://api.insee.fr/entreprises/sirene/V3.11/siret/${sanitizedSiret}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer e16f36fb-f659-327f-bad1-7554578ceff5`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 404) {
        console.error("Erreur : Le numéro de SIRET n'existe pas.");
        setErrorMessage("Le numéro de SIRET n'existe pas.");
        setSiretValid(false);
      } else if (!response.ok) {
        const errorText = await response.json();
        console.error(
          "Erreur lors de la vérification du numéro de SIRET :",
          errorText
        );
        setErrorMessage(
          errorText.message ||
            "Erreur lors de la vérification du numéro de SIRET."
        );
        setSiretValid(false);
      } else {
        const data = await response.json();
        if (data && data.etablissement) {
          console.log("Le numéro de SIRET est valide :", data.etablissement);
          setErrorMessage("");
          setCompanyInfo(data.etablissement);
          setSiretValid(true);

          // Appeler la fonction de comparaison
          compareFormValues(data.etablissement);
        } else {
          console.error(
            "Erreur : Le SIRET a été trouvé, mais la propriété attendue n'est pas présente."
          );
          setErrorMessage(
            "Le numéro de SIRET est valide, mais des informations sont manquantes."
          );
          setSiretValid(true);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du SIRET :", error);
      setErrorMessage("Erreur lors de la vérification du SIRET.");
      setSiretValid(false);
    }
  };

  const compareFormValues = (companyInfo) => {
    const Adresse =
      `${companyInfo.adresseEtablissement.numeroVoieEtablissement} ${companyInfo.adresseEtablissement.typeVoieEtablissement} ${companyInfo.adresseEtablissement.libelleVoieEtablissement}`.trim();
    const Ville =
      companyInfo.adresseEtablissement.libelleCommuneEtablissement.trim();
    const NomSociete = companyInfo.uniteLegale.denominationUniteLegale.trim();
    const CodePostal =
      companyInfo.adresseEtablissement.codePostalEtablissement.trim();

    console.log("Données récupérées pour comparaison :", {
      Adresse,
      Ville,
      CodePostal,
      NomSociete,
    });
    console.log("Données saisies dans le formulaire :", {
      adresse: editedCompany.adresse,
      ville: editedCompany.ville,
      nomSociete: editedCompany.nomSociete,
      codePostal: editedCompany.codePostal,
    });

    let mismatchMessages = [];

    // Comparer chaque champ individuellement et ajouter un message si non correspondant
    if (Adresse !== editedCompany.adresse) {
      mismatchMessages.push(
        `Adresse ne correspond pas : attendu "${Adresse}", reçu "${editedCompany.adresse}"`
      );
    }
    if (Ville !== editedCompany.ville) {
      mismatchMessages.push(
        `Ville ne correspond pas : attendu "${Ville}", reçu "${editedCompany.ville}"`
      );
    }
    if (NomSociete !== editedCompany.nomSociete) {
      mismatchMessages.push(
        `Nom de la société ne correspond pas : attendu "${NomSociete}", reçu "${editedCompany.nomSociete}"`
      );
    }
    if (CodePostal !== editedCompany.codePostal) {
      mismatchMessages.push(
        `Code postal ne correspond pas : attendu "${CodePostal}", reçu "${editedCompany.codePostal}"`
      );
    }

    if (mismatchMessages.length === 0) {
      console.log("La modification a réussi : les informations correspondent.");
      setErrorMessage("Modification réussie !");
    } else {
      console.error(
        "Échec de la modification : les informations ne correspondent pas."
      );
      mismatchMessages.forEach((msg) => console.error(msg));
      setErrorMessage(
        "Échec de la modification : certaines informations ne correspondent pas."
      );
    }
  };

  const handleEditCompanyClick = async () => {
    if (isEditingCompany) {
      verifySiret();
      const formData = new FormData();
      formData.append("nomSociete", editedCompany.nomSociete);
      formData.append("siret", editedCompany.siret);
      formData.append("codePostal", editedCompany.codePostal);
      formData.append("ville", editedCompany.ville);
      formData.append("adresse", editedCompany.adresse);
      formData.append("secteurActivite", editedCompany.secteurActivite);
      formData.append("typeSociete", editedCompany.typeSociete);

      if (imageDetails) {
        formData.append("image", imageDetails);
      }

      try {
        const response = await fetch(
          `/api/userPro/company/${user.company.id}`,
          {
            method: "PUT",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Échec de la mise à jour du profil utilisateur");
        }

        await fetchUserData();
        setIsEditingCompany(false);
        toast.success("Profil mis à jour avec succès !");
      } catch (error) {
        console.error("Erreur lors de la mise à jour du profil :", error);
        alert("Erreur lors de la mise à jour du profil. Veuillez réessayer.");
      }
    } else {
      setEditedCompany({
        siret: "",
        adresse: "",
        codePostal: "",
        nomSociete: "",
        ville: "",
        secteurActivite: "",
        typeSociete: "",
      });
      setIsEditingCompany(true);
    }
  };

  const handleDeleteCompanyClick = async () => {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer la société avec l'ID : ${user.company.id}`
    );
    if (confirmed) {
      try {
        const response = await fetch(
          `/api/userPro/company/${user.company.id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          toast.success(
            "Les données de la société ont été supprimées avec succès."
          );
          router.push("/userPro");
        } else {
          throw new Error("Erreur lors de la suppression de l'user.");
        }
      } catch (error) {
        alert("Erreur lors de la suppression de l'user.");
        console.error("Erreur lors de la suppression de l'user :", error);
      }
    }
  };

  ////////////////////////////FONCTION POUR LES MODIFICATIONS DE LA SOCIETE////////////////////

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageDetails(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  ////////////////////////////FONCTION POUR LA MODIFICATION DE L'IMAGE////////////////////

  if (loading) {
    return (
      <div>
        <AnimatedSymbol />
      </div>
    );
  }

  if (error) {
    return <p>Erreur : {error}</p>;
  }

  if (!user) {
    return <p>Aucune information utilisateur disponible.</p>;
  }
  if (!userId) {
    return <p>Utilisateur introuvable</p>;
  }

  return (
    <div className=" min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-6xl mx-auto bg-white shadow-lg">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              {/* image */}
              <div className="w-full md:w-2/3 bg-primary flex flex-col items-center justify-center p-8 relative">
                <div className="relative group">
                  <Avatar className="w-52 h-52 border-4 border-white shadow-lg transition-all duration-300 ease-in-out group-hover:scale-105">
                    <AvatarImage
                      src={profileImage}
                      alt={`${user.nom} ${user.prenom}`}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-blue-200 text-blue-700 text-4xl">
                      {user.nom[0]}
                      {user.prenom[0]}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer transition-all duration-300 ease-in-out hover:bg-blue-100">
                      <ImagePlus className="w-6 h-6 text-blue-500" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <h2 className="mt-6 text-2xl font-bold text-white text-center">
                  {user.prenom} {user.nom}
                </h2>
                <p className="mt-2 text-blue-100 text-center">{user.email}</p>
              </div>

              <Tabs defaultValue="adminCompte" className="w-full bg-inherit">
                <TabsList className="flex space-x-4 justify-between px-5 rounded-none">
                  <TabsTrigger
                    value="adminCompte"
                    className="relative py-2 px-4 text-base font-medium "
                  >
                    Administrateur du compte
                  </TabsTrigger>
                  <TabsTrigger
                    value="companyInfo"
                    className="relative py-2 px-4 text-base font-medium"
                  >
                    Informations de la société
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="adminCompte" className="mx-auto">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-3xl font-bold text-gray-800 mb-6">
                        Profil de l&apos;administrateur du compte
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="space-y-4 mb-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-y-0">
                          <div className="space-y-2">
                            <Label
                              htmlFor="prenom"
                              className="text-base font-semibold text-gray-600"
                            >
                              Prénoms
                            </Label>
                            <Input
                              id="prenom"
                              value={
                                isEditing ? editedUser.prenom : user.prenom
                              }
                              readOnly={!isEditing}
                              onChange={handleInputChange}
                              className={`bg-gray-50 text-base ${
                                isEditing ? "" : "cursor-not-allowed"
                              }`}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="nom"
                              className="text-base font-semibold text-gray-600"
                            >
                              Nom
                            </Label>
                            <Input
                              id="nom"
                              value={isEditing ? editedUser.nom : user.nom}
                              readOnly={!isEditing}
                              onChange={handleInputChange}
                              className={`bg-gray-50 ${
                                isEditing ? "" : "cursor-not-allowed"
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 mb-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-y-0">
                          <div className="space-y-2">
                            <Label
                              htmlFor="email"
                              className="text-base font-semibold text-gray-600"
                            >
                              Email
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={isEditing ? editedUser.email : user.email}
                              readOnly={!isEditing}
                              onChange={handleInputChange}
                              className={`bg-gray-50 ${
                                isEditing ? "" : "cursor-not-allowed"
                              }`}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="phone"
                              className="text-base font-semibold text-gray-600"
                            >
                              Numéro de téléphone
                            </Label>
                            <div className="relative w-full">
                              <PhoneInput
                                country={"fr"}
                                value={
                                  isEditing ? editedUser.phone : user.phone
                                }
                                onChange={(phone) => {
                                  setEditedUser((prevState) => ({
                                    ...prevState,
                                    phone: `+${phone}`,
                                  }));
                                }}
                                inputProps={{
                                  id: "phone",
                                  readOnly: !isEditing,
                                }}
                                inputClass={`!w-full bg-gray-50 ${
                                  isEditing ? "" : "cursor-not-allowed"
                                }`}
                                disabled={!isEditing}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="w-full">
                      <div className="mt-10 space-y-2 w-full">
                        <button
                          onClick={handleEditClick}
                          className="mr-4 bg-primary w-full text-white px-4 py-2 rounded"
                        >
                          {isEditing
                            ? "Enregistrer les modifications"
                            : "Modifier le profil"}
                        </button>
                        {!isEditing && (
                          <button
                            onClick={handleDeleteClick}
                            className="bg-red-500 text-white text-base font-semibold w-full px-4 py-2 rounded"
                          >
                            Supprimer le profil
                          </button>
                        )}
                        {isEditing && (
                          <button
                            onClick={() => setIsEditing(false)}
                            className=" bg-gray-400 text-white text-base font-semibold w-full px-4 py-2 rounded"
                          >
                            Annuler
                          </button>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="companyInfo" className="mx-auto">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-3xl font-bold text-gray-800 mb-6">
                        Profil de la société{" "}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          {/* SIRET */}
                          <div className="space-y-2">
                            <Label
                              htmlFor="siret"
                              className="text-base font-semibold text-gray-600"
                            >
                              SIRET
                            </Label>
                            <Input
                              id="siret"
                              value={
                                isEditingCompany
                                  ? editedCompany.siret
                                  : user.company.siret
                              }
                              readOnly={!isEditingCompany}
                              onChange={handleInputChange}
                              className={`bg-gray-50 ${
                                isEditingCompany ? "" : "cursor-not-allowed"
                              }`}
                            />
                          </div>

                          {/* NOM DE LA SOCIETE */}
                          <div className="space-y-2">
                            <Label
                              htmlFor="nomSociete"
                              className="text-base font-semibold text-gray-600"
                            >
                              Nom de la société
                            </Label>
                            <Input
                              id="nomSociete"
                              value={
                                isEditingCompany
                                  ? editedCompany.nomSociete
                                  : user.company.nomSociete
                              }
                              readOnly={!isEditingCompany}
                              onChange={handleInputChange}
                              className={`bg-gray-50 ${
                                isEditingCompany ? "" : "cursor-not-allowed"
                              }`}
                            />
                          </div>
                        </div>

                        {/* ADRESSE */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="adresse"
                            className="text-base font-semibold text-gray-600"
                          >
                            Adresse
                          </Label>
                          <Input
                            id="adresse"
                            value={
                              isEditingCompany
                                ? editedCompany.adresse
                                : user.company.adresse
                            }
                            readOnly={!isEditingCompany}
                            onChange={handleInputChange}
                            className={`bg-gray-50 ${
                              isEditingCompany ? "" : "cursor-not-allowed"
                            }`}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {/* CODE POSTAL */}
                          <div className="space-y-2">
                            <Label
                              htmlFor="codePostal"
                              className="text-base font-semibold text-gray-600"
                            >
                              Code postal
                            </Label>
                            <Input
                              id="codePostal"
                              value={
                                isEditingCompany
                                  ? editedCompany.codePostal
                                  : user.company.codePostal
                              }
                              readOnly={!isEditingCompany}
                              onChange={handleInputChange}
                              className={`bg-gray-50 ${
                                isEditingCompany ? "" : "cursor-not-allowed"
                              }`}
                            />
                          </div>

                          {/* VILLE */}
                          <div className="space-y-2">
                            <Label
                              htmlFor="ville"
                              className="text-base font-semibold text-gray-600"
                            >
                              Ville
                            </Label>
                            <Input
                              id="ville"
                              value={
                                isEditingCompany
                                  ? editedCompany.ville
                                  : user.company.ville
                              }
                              readOnly={!isEditingCompany}
                              onChange={handleInputChange}
                              className={`bg-gray-50 ${
                                isEditingCompany ? "" : "cursor-not-allowed"
                              }`}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {/* SECTEUR */}
                          <div className="space-y-2">
                            <Label
                              htmlFor="secteur"
                              className="text-base font-semibold text-gray-600"
                            >
                              Secteur d&apos;activité
                            </Label>
                            <Select
                              className="w-full"
                              value={
                                isEditingCompany
                                  ? editedCompany.secteurActivite
                                  : user.company.secteurActivite || ""
                              }
                              onValueChange={(value) => {
                                if (isEditingCompany) {
                                  setEditedCompany((prevState) => ({
                                    ...prevState,
                                    secteurActivite: value || "",
                                  }));
                                }
                              }}
                              disabled={!isEditingCompany}
                            >
                              <SelectTrigger className="w-full px-4">
                                <SelectValue
                                  placeholder="Sélectionner le secteur"
                                  className="flex items-start"
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value="IMMOBILIER">
                                    Immobilier
                                  </SelectItem>
                                  <SelectItem value="VETEMENT">
                                    Vêtements
                                  </SelectItem>
                                  <SelectItem value="EMPLOI">
                                    Emplois / Recrutement
                                  </SelectItem>
                                  <SelectItem value="SERVICE">
                                    Services
                                  </SelectItem>
                                  <SelectItem value="VOITURE">
                                    Voitures
                                  </SelectItem>
                                  <SelectItem value="LOISIR">Loisir</SelectItem>
                                  <SelectItem value="MATERIEL">
                                    Matériels / Equipements
                                  </SelectItem>
                                  <SelectItem value="MOBILIER">
                                    Mobilier
                                  </SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* TYPE */}
                          <div className="space-y-2">
                            <Label
                              htmlFor="type"
                              className="text-base font-semibold text-gray-600"
                            >
                              Type de société
                            </Label>
                            <Select
                              className="w-full"
                              value={
                                isEditingCompany
                                  ? editedCompany.typeSociete || ""
                                  : user.company.typeSociete || ""
                              }
                              onValueChange={(value) => {
                                if (isEditingCompany) {
                                  setEditedCompany((prevState) => ({
                                    ...prevState,
                                    typeSociete: value || "",
                                  }));
                                }
                              }}
                              disabled={!isEditingCompany}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Sélectionner le type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value="ENTREPRISE_INDIVIDUELLE">
                                    Entreprise individuelle
                                  </SelectItem>
                                  <SelectItem value="SOCIETE_PRIVEE">
                                    Société privée
                                  </SelectItem>
                                  <SelectItem value="SOCIETE_PUBLIQUE">
                                    Société publique
                                  </SelectItem>
                                  <SelectItem value="COOPERATIVE">
                                    Coopérative
                                  </SelectItem>
                                  <SelectItem value="ASSOCIATION">
                                    Association
                                  </SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="w-full">
                      <div className="mt-10 space-y-2 w-full">
                        <button
                          onClick={handleEditCompanyClick}
                          className="mr-4 bg-primary w-full text-white px-4 py-2 rounded"
                        >
                          {isEditingCompany
                            ? "Enregistrer les modifications"
                            : "Modifier le profil"}
                        </button>
                        {!isEditingCompany && (
                          <button
                            onClick={handleDeleteCompanyClick}
                            className="bg-red-500 text-white text-base font-semibold w-full px-4 py-2 rounded"
                          >
                            Supprimer le profil
                          </button>
                        )}
                        {isEditingCompany && (
                          <button
                            onClick={() => setIsEditingCompany(false)}
                            className=" bg-gray-400 text-white text-base font-semibold w-full px-4 py-2 rounded"
                          >
                            Annuler
                          </button>
                        )}
                        {profileLink ? (
                          <Link href={profileLink} passHref>
                            <Button
                              variant="outline"
                              className="w-full group mt-2 bg-primary hover:bg-primary text-white hover:text-white transition-colors duration-300"
                            >
                              <span className="mr-2">
                                Connecter le compte à stripe
                              </span>
                            </Button>
                          </Link>
                        ) : (
                          <Button
                            onClick={generateProfileLink}
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-300"
                          >
                            Générer le lien de connexion à stripe
                          </Button>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
      {showVerifInfo && (
        <CodeVerificationDialog
          onVerify={handleVerifyCodes}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
};

export default UserProfilePreview;

const CodeVerificationDialog = ({ onVerify, onCancel }) => {
  const [emailCodeInput, setEmailCodeInput] = useState("");
  //const [phoneCodeInput, setPhoneCodeInput] = useState("");

  const handleVerify = () => {
    onVerify(emailCodeInput, phoneCodeInput);
    setEmailCodeInput("");
    //setPhoneCodeInput("");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-md px-4"
      >
        <Card className="relative p-4">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Vérification des codes
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={onCancel}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fermer</span>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emailCode">Code email</Label>
              <Input
                id="emailCode"
                value={emailCodeInput}
                onChange={(e) => setEmailCodeInput(e.target.value)}
                placeholder="Entrez le code reçu par email"
              />
            </div>
          </CardContent>
          <CardFooter className=" w-full flex flex-col justify-between space-y-4">
            <Button className="w-full" onClick={handleVerify}>
              Vérifier
            </Button>
            <Button variant="secondary" className="w-full" onClick={onCancel}>
              Annuler
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
};
