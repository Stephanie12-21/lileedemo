"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Eye, EyeOff } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUpPage = () => {
  const [step, setStep] = useState(1);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [imageFile, setImageFile] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [emailVerificationCode, setEmailVerificationCode] = useState("");
  const [verificationCodePhone, setVerificationCodePhone] = useState("");
  const [phoneVerificationCode, setPhoneVerificationCode] = useState("");
  const router = useRouter();

  //INFORMATIONS DE LA SOCIETE
  const [siret, setSiret] = useState("");
  const [nomSociete, setNomSociete] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [adresse, setAdresse] = useState("");
  const [ville, setVille] = useState("");
  const [secteurActivite, setSecteurActivite] = useState("");
  const [typeSociete, setTypeSociete] = useState("");
  const [companyInfo, setCompanyInfo] = useState("");
  const [siretValid, setSiretValid] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  function generateVerificationCodes() {
    const emailVerificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const phoneVerificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    return { emailVerificationCode, phoneVerificationCode };
  }

  const handlePreviousStep = () => {
    if (step > 1) {
      const previousStep = step - 1;
      setStep(previousStep);
    }
  };

  const handleNextStep = async () => {
    if (step === 1) {
      verifySiret();
    } else if (step === 4) {
      const generatedCodes = generateVerificationCodes();
      try {
        const response = await fetch("/api/user/emailVerif/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            prenom,

            verificationCode: generatedCodes.emailVerificationCode,
          }),
        });

        if (!response.ok) {
          throw new Error("Erreur lors de l'envoi de l'e-mail");
        }

        toast.info("E-mail envoyé avec succès");
        setEmailVerificationCode(generatedCodes.emailVerificationCode);
      } catch (error) {
        toast.error("Erreur lors de l'envoi de l'e-mail : " + error.message);
        return;
      }
    } else if (step === 5) {
      if (verificationCode !== emailVerificationCode) {
        alert("Le code de vérification est incorrect.");
        return;
      }
      toast.info("Code de vérification correct.");
    }
    // else if (step === 6) {
    //   const generatedCodes = generateVerificationCodes();
    //   const Phone = `+${phone}`;
    //   try {
    //     const response = await fetch("/api/user/verifPhone/", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         Phone,
    //         prenom,
    //         verificationCode: generatedCodes.phoneVerificationCode,
    //       }),
    //     });

    //     if (!response.ok) {
    //       throw new Error("Erreur lors de l'envoi du SMS");
    //     }

    //     toast.info("SMS envoyé avec succès");
    //     console.log(
    //       "Code de vérification envoyé par SMS:",
    //       generatedCodes.phoneVerificationCode
    //     );
    //     setPhoneVerificationCode(generatedCodes.phoneVerificationCode);
    //   } catch (error) {
    //     toast.error("Erreur lors de l'envoi de l'e-mail : " + error.message);
    //     return;
    //   }
    // }
    // else if (step === 7) {
    //   if (verificationCodePhone !== phoneVerificationCode) {
    //     toast.error("Le code de vérification est incorrect.");
    //     return;
    //   }
    //   toast.info("Code de vérification correct.");
    // }
    if (step < 9) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const slideVariants = {
    initial: (direction) => ({
      x: direction < 0 ? -300 : 300,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      transition: { duration: 0.5 },
    }),
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Veuillez télécharger un fichier image valide.");
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const role = "PRO";
    const Phone = `+${phone}`;
    const statutUser = "ACTIF";
    const formData = new FormData();
    formData.append("nom", nom);
    formData.append("prenom", prenom);
    formData.append("email", email);
    formData.append("phone", Phone);
    formData.append("password", password);
    formData.append("role", role);
    formData.append("statutUser", statutUser);

    formData.append("secteurActivite", secteurActivite);
    formData.append("typeSociete", typeSociete);
    formData.append("siret", siret);
    formData.append(
      "nomSociete",
      companyInfo.denomination || companyInfo.nom_entreprise
    );
    formData.append("adresse", companyInfo.siege?.adresse_ligne_1 || "");
    formData.append("codePostal", companyInfo.siege?.code_postal || "");
    formData.append("ville", companyInfo.siege?.ville || "");
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    try {
      const response = await fetch("/api/userPro/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'envoi des données.");
      } else {
        router.push(`/login`);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi des données :", error);
    }
  };

  const verifySiret = async () => {
    const sanitizedSiret = siret.replace(/\s/g, "");

    if (!/^\d{14}$/.test(sanitizedSiret)) {
      setErrorMessage(
        "Le numéro de SIRET doit contenir exactement 14 chiffres."
      );
      setSiretValid(false);
      return;
    }

    try {
      const response = await fetch("/api/user/verifySiret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siret: sanitizedSiret }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(
          result.errorMessage || "Erreur lors de la vérification du SIRET"
        );
        setSiretValid(false);
        return;
      }

      if (result.valid && result.data) {
        setCompanyInfo(result.data);
        setErrorMessage("");
        setSiretValid(true);
      } else {
        setErrorMessage(result.errorMessage || "Numéro de SIRET introuvable.");
        setSiretValid(false);
      }
    } catch (error) {
      console.error("Erreur SIRET :", error);
      setErrorMessage("Impossible de vérifier le SIRET pour le moment.");
      setSiretValid(false);
    }
  };

  const handlePrevPage = () => {
    router.push("/signup");
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen ">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center ">
            <Image
              src="/assets/logo.svg"
              width={150}
              height={100}
              alt="Logo Lilee"
              className="mx-auto h-24 w-auto"
            />
          </div>

          <motion.div
            className="w-full h-[80%] mx-1 flex gap-4 items-start"
            key={step}
            custom={step}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={slideVariants}
          >
            {/* informations concernant la societé */}

            {/* numéro de siret, nom de la société  */}
            {step === 1 && (
              <div className="grid gap-4 w-[400px] items-start">
                <div className="grid space-y-3">
                  <Label htmlFor="siret">Votre SIRET</Label>
                  <Input
                    type="text"
                    name="siret"
                    placeholder="Votre numéro de siret"
                    value={siret}
                    onChange={(e) => setSiret(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="pt-6 flex space-x-8 justify-center">
                  <Button
                    onClick={handlePrevPage}
                    className="w-full  text-[16px]"
                  >
                    Retour
                  </Button>
                  <Button
                    onClick={handleNextStep}
                    className="w-full text-[16px]"
                  >
                    Suivant
                  </Button>
                </div>
                {/* ============= */}
                <div className="mt-6 text-center text-base">
                  <span className="text-gray-600 dark:text-gray-400">
                    Vous êtes déjà membre?{" "}
                  </span>
                  <Link
                    href="/login"
                    className="font-medium text-[#15213d] focus:ring-[#15213d] dark:text-[#15213d] dark:hover:text-[#15213d] hover:underline"
                  >
                    Se connecter
                  </Link>
                </div>
              </div>
            )}

            {/* code postal - ville - adresse */}
            {siretValid === true && companyInfo && (
              <>
                {step === 2 && (
                  <div className="grid gap-8 w-[400px] items-start">
                    <div className="grid space-y-2">
                      <Label htmlFor="nomSociete">Le nom de la société</Label>
                      <Input
                        type="text"
                        name="nomSociete"
                        placeholder="Le nom de votre société"
                        value={
                          companyInfo.nom_entreprise || companyInfo.denomination
                        }
                        onChange={(e) => setNomSociete(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>

                    <div className="grid space-y-2">
                      <Label htmlFor="societe-adresse">L&apos;adresse</Label>
                      <Input
                        type="text"
                        name="adresse"
                        placeholder="L'adresse"
                        value={`${companyInfo.siege.adresse_ligne_1} `}
                        onChange={(e) => setAdresse(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>

                    <div className="grid space-y-2">
                      <Label htmlFor="societe-code-postal">
                        Le code postal
                      </Label>
                      <Input
                        type="text"
                        name="codePostal"
                        placeholder="Le code postal de votre société"
                        value={companyInfo.siege.code_postal}
                        onChange={(e) => setCodePostal(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>

                    <div className="grid space-y-2">
                      <Label htmlFor="societe-ville-">
                        La ville de localisaton
                      </Label>

                      <Input
                        type="text"
                        name="ville"
                        placeholder="Le ville de localisation"
                        value={companyInfo.siege.ville}
                        onChange={(e) => setVille(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>

                    <div className="pt-6 flex space-x-8 justify-center">
                      <Button
                        onClick={handlePreviousStep}
                        className="w-full text-[16px]"
                      >
                        Retour
                      </Button>
                      <Button
                        onClick={handleNextStep}
                        className="w-full text-[16px]"
                      >
                        Suivant
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* secteur - type */}
            {step === 3 && (
              <div className="grid gap-9 w-[400px] items-start">
                {/* secteur */}
                <div className="grid space-y-3">
                  <Label htmlFor="societe-secteur">
                    Le secteur d&apos;activité
                  </Label>
                  <Select
                    className="w-full"
                    onValueChange={(value) => setSecteurActivite(value)}
                  >
                    <SelectTrigger className="w-full px-4">
                      <SelectValue
                        placeholder="Selectionner le secteur"
                        className="flex items-start"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="IMMOBILIER">Immobilier</SelectItem>
                        <SelectItem value="VETEMENT">Vêtements</SelectItem>
                        <SelectItem value="EMPLOI">
                          Emplois / Recrutement
                        </SelectItem>
                        <SelectItem value="SERVICE">Services</SelectItem>
                        <SelectItem value="VOITURE">Voitures</SelectItem>
                        <SelectItem value="LOISIR">Loisir</SelectItem>
                        <SelectItem value="MATERIEL">
                          Matériels / Equipements
                        </SelectItem>
                        <SelectItem value="MOBILIER">Mobilier</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* type */}
                <div className="grid space-y-3">
                  <Label htmlFor="societe-type">Le type de société</Label>
                  <Select
                    className="w-full"
                    onValueChange={(value) => setTypeSociete(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="ENTREPRISE_INDIVIDUELLE">
                          Entreprise individuelle
                        </SelectItem>
                        <SelectItem value="SOCIETE_PRIVEE">
                          Société privée
                        </SelectItem>
                        <SelectItem value=" SOCIETE_PUBLIQUE">
                          Société publique
                        </SelectItem>
                        <SelectItem value="COOPERATIVE">Coopérative</SelectItem>
                        <SelectItem value="ASSOCIATION">Association</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-6 flex space-x-8 justify-center">
                  <Button
                    onClick={handlePreviousStep}
                    className="w-full text-[16px]"
                  >
                    Retour
                  </Button>
                  <Button
                    onClick={handleNextStep}
                    className="w-full text-[16px]"
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            )}

            {/*  informations de l'admin du compte  */}
            {/* nom-prenom-email */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="grid gap-4 w-[400px] items-start">
                  <h1 className="text-2xl pb-5 font-bold max-md:text-start">
                    On continue avec les informations de l&apos;administrateur
                    de ce compte
                  </h1>
                  <div className="grid space-y-3">
                    <Label htmlFor="prenom">Le prénom</Label>
                    <Input
                      type="text"
                      name="firstName"
                      placeholder="Votre prénom"
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div className="grid space-y-3">
                    <Label htmlFor="nom">Le nom</Label>
                    <Input
                      type="text"
                      name="lastName"
                      placeholder="Votre nom"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="grid space-y-3">
                    <Label htmlFor="email">L&apos; adresse email</Label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="pt-6 flex space-x-8 justify-center">
                    <Button
                      onClick={handlePreviousStep}
                      className="w-full text-[16px]"
                    >
                      Retour
                    </Button>
                    <Button
                      onClick={handleNextStep}
                      className="w-full text-[16px]"
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* vérification email */}
            {step === 5 && (
              <div className="grid gap-4 h-full w-[400px]">
                <div className="space-y-3">
                  <Label className="text-balance text-[16px] text-muted-foreground max-md:text-center pb-6">
                    Nous avons envoyé un code de vérification à votre adresse
                    email. <br /> <br /> Veuillez le saisir ici.
                  </Label>
                  <Input
                    type="text"
                    placeholder="Entrez le code de vérification"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  <div className="pt-6 flex space-x-8 justify-center">
                    <Button
                      onClick={handlePreviousStep}
                      className="w-full text-[16px]"
                    >
                      Retour
                    </Button>
                    <Button
                      onClick={handleNextStep}
                      className="w-full text-[16px]"
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* numéro et mot de passe  */}
            {step === 6 && (
              <div className="grid gap-4 h-full w-[400px]">
                <div className="space-y-4">
                  <div className="grid space-y-2 h-fit">
                    <Label htmlFor="num">Votre numéro de téléphone</Label>
                    <PhoneInput
                      country={"fr"}
                      value={phone}
                      onChange={(value) => setPhone(value)} // Utilisez `value` au lieu de `e.target.value`
                      placeholder="Entrez votre numéro"
                      inputStyle={{
                        width: "100%",
                        height: "40px",
                        fontSize: "16px",
                      }}
                      inputClass="col-span-2 items-start w-full bg-[#edf2f7] text-[15px] text-[#27272E] font-medium"
                    />
                  </div>

                  <div className="relative">
                    <Label htmlFor="num">Votre mot de passe</Label>
                    <Input
                      id="password"
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="*******"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white pr-10 text-[16px] font-medium"
                    />
                    <div
                      className="absolute top-1/2 right-3 flex items-center cursor-pointer"
                      onClick={togglePasswordVisibility}
                    >
                      {isPasswordVisible ? (
                        <Eye className="w-5 h-5 text-gray-600" />
                      ) : (
                        <EyeOff className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                  </div>

                  <div className="pt-6 flex space-x-8 justify-center">
                    <Button
                      onClick={handlePreviousStep}
                      className="w-full text-[16px]"
                    >
                      Retour
                    </Button>
                    <Button
                      onClick={handleNextStep}
                      className="w-full text-[16px]"
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* vérification phone */}
            {/* {step === 7 && (
              <div className="grid gap-4 h-full w-[400px]">
                <div className="space-y-3">
                  <Label className="text-balance text-[16px] text-muted-foreground max-md:text-center pb-6">
                    Nous avons envoyé un code de vérification à votre numéro de
                    téléphone. <br /> <br /> Veuillez le saisir ici.
                  </Label>
                  <Input
                    type="text"
                    placeholder="Entrez le code de vérification"
                    value={verificationCodePhone}
                    onChange={(e) => setVerificationCodePhone(e.target.value)}
                    className="bg-white p-2 border border-gray-300 rounded"
                  />
                  <div className="pt-6 flex space-x-8 justify-center">
                    <Button
                      onClick={handlePreviousStep}
                      className="w-full text-[16px]"
                    >
                      Retour
                    </Button>
                    <Button
                      onClick={handleNextStep}
                      className="w-full text-[16px]"
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              </div>
            )} */}

            {/* image du profil */}
            {step === 7 && (
              <div className="grid gap-4 h-full w-[400px]">
                <div className="space-y-4">
                  <Label className="text-balance text-[16px] text-muted-foreground max-md:text-center pb-6">
                    L&apos;ajout de l&apos;image est optionnelle.
                  </Label>
                  <Input
                    type="file"
                    accept="image/*"
                    id="imageFile"
                    onChange={handleImageChange}
                    className="bg-white p-2 border border-gray-300 rounded"
                  />
                  {selectedImage && (
                    <div className="mt-2 flex items-center justify-center">
                      <Image
                        src={selectedImage}
                        alt="Selected preview"
                        width={300}
                        height={300}
                        className="rounded-full"
                      />
                    </div>
                  )}
                  <div className="pt-6 flex space-x-8 justify-center">
                    <Button
                      onClick={handlePreviousStep}
                      className="w-full text-[16px]"
                    >
                      Retour
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      className="w-full text-[16px]"
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="hidden lg:block relative w-0 flex-1">
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src="/assets/marcus-aurelius.jpg"
          alt="Marcus Aurelius"
          layout="fill"
        />
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
        theme="light"
      />
    </div>
  );
};

export default SignUpPage;
