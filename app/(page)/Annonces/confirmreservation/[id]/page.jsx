"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Loader2, StarIcon, TagIcon } from "lucide-react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { loadStripe } from "@stripe/stripe-js";
import { NextResponse } from "next/server";

const PAYS = [
  { label: "Afghanistan", value: "afghanistan" },
  { label: "Afrique du Sud", value: "afrique-du-sud" },
  { label: "Albanie", value: "albanie" },
  { label: "Algérie", value: "algerie" },
  { label: "Allemagne", value: "allemagne" },
  { label: "Andorre", value: "andorre" },
  { label: "Angola", value: "angola" },
  { label: "Antigua-et-Barbuda", value: "antigua-et-barbuda" },
  { label: "Arabie saoudite", value: "arabie-saoudite" },
  { label: "Argentine", value: "argentine" },
  { label: "Arménie", value: "armenie" },
  { label: "Australie", value: "australie" },
  { label: "Autriche", value: "autriche" },
  { label: "Azerbaïdjan", value: "azerbaidjan" },
  { label: "Bahamas", value: "bahamas" },
  { label: "Bahreïn", value: "bahrein" },
  { label: "Bangladesh", value: "bangladesh" },
  { label: "Barbade", value: "barbade" },
  { label: "Belgique", value: "belgique" },
  { label: "Belize", value: "belize" },
  { label: "Bénin", value: "benin" },
  { label: "Bhoutan", value: "bhoutan" },
  { label: "Biélorussie", value: "bielorussie" },
  { label: "Birmanie", value: "birmanie" },
  { label: "Bolivie", value: "bolivie" },
  { label: "Bosnie-Herzégovine", value: "bosnie-herzegovine" },
  { label: "Botswana", value: "botswana" },
  { label: "Brésil", value: "bresil" },
  { label: "Brunei", value: "brunei" },
  { label: "Bulgarie", value: "bulgarie" },
  { label: "Burkina Faso", value: "burkina-faso" },
  { label: "Burundi", value: "burundi" },
  { label: "Cabo Verde", value: "cabo-verde" },
  { label: "Cambodge", value: "cambodge" },
  { label: "Cameroun", value: "cameroun" },
  { label: "Canada", value: "canada" },
  { label: "Chili", value: "chili" },
  { label: "Chine", value: "chine" },
  { label: "Chypre", value: "chypre" },
  { label: "Colombie", value: "colombie" },
  { label: "Comores", value: "comores" },
  { label: "Congo (Brazzaville)", value: "congo-brazzaville" },
  { label: "Congo (Kinshasa)", value: "congo-kinshasa" },
  { label: "Corée du Nord", value: "coree-du-nord" },
  { label: "Corée du Sud", value: "coree-du-sud" },
  { label: "Costa Rica", value: "costa-rica" },
  { label: "Côte d’Ivoire", value: "cote-divoire" },
  { label: "Croatie", value: "croatie" },
  { label: "Cuba", value: "cuba" },
  { label: "Danemark", value: "danemark" },
  { label: "Djibouti", value: "djibouti" },
  { label: "Dominique", value: "dominique" },
  { label: "Égypte", value: "egypte" },
  { label: "Émirats arabes unis", value: "emirats-arabes-unis" },
  { label: "Équateur", value: "equateur" },
  { label: "Érythrée", value: "erythree" },
  { label: "Espagne", value: "espagne" },
  { label: "Estonie", value: "estonie" },
  { label: "Eswatini", value: "eswatini" },
  { label: "États-Unis", value: "etats-unis" },
  { label: "Éthiopie", value: "ethiopie" },
  { label: "Fidji", value: "fidji" },
  { label: "Finlande", value: "finlande" },
  { label: "France", value: "france" },
  { label: "Gabon", value: "gabon" },
  { label: "Gambie", value: "gambie" },
  { label: "Géorgie", value: "georgie" },
  { label: "Ghana", value: "ghana" },
  { label: "Grèce", value: "grece" },
  { label: "Grenade", value: "grenade" },
  { label: "Guatemala", value: "guatemala" },
  { label: "Guinée", value: "guinee" },
  { label: "Guinée-Bissau", value: "guinee-bissau" },
  { label: "Guyana", value: "guyana" },
  { label: "Haïti", value: "haiti" },
  { label: "Honduras", value: "honduras" },
  { label: "Hongrie", value: "hongrie" },
  { label: "Inde", value: "inde" },
  { label: "Indonésie", value: "indonesie" },
  { label: "Irak", value: "irak" },
  { label: "Iran", value: "iran" },
  { label: "Irlande", value: "irlande" },
  { label: "Islande", value: "islande" },
  { label: "Israël", value: "israel" },
  { label: "Italie", value: "italie" },
  { label: "Jamaïque", value: "jamaique" },
  { label: "Japon", value: "japon" },
  { label: "Jordanie", value: "jordanie" },
  { label: "Kazakhstan", value: "kazakhstan" },
  { label: "Kenya", value: "kenya" },
  { label: "Kirghizistan", value: "kirghizistan" },
  { label: "Kiribati", value: "kiribati" },
  { label: "Koweït", value: "koweit" },
  { label: "Laos", value: "laos" },
  { label: "Lesotho", value: "lesotho" },
  { label: "Lettonie", value: "lettonie" },
  { label: "Liban", value: "liban" },
  { label: "Libéria", value: "liberia" },
  { label: "Libye", value: "libye" },
  { label: "Liechtenstein", value: "liechtenstein" },
  { label: "Lituanie", value: "lituanie" },
  { label: "Luxembourg", value: "luxembourg" },
  { label: "Madagascar", value: "madagascar" },
  { label: "Malaisie", value: "malaisie" },
  { label: "Malawi", value: "malawi" },
  { label: "Maldives", value: "maldives" },
  { label: "Mali", value: "mali" },
  { label: "Malte", value: "malte" },
  { label: "Maroc", value: "maroc" },
  { label: "Maurice", value: "maurice" },
  { label: "Mauritanie", value: "mauritanie" },
  { label: "Mexique", value: "mexique" },
  { label: "Micronésie", value: "micronesie" },
  { label: "Moldavie", value: "moldavie" },
  { label: "Monaco", value: "monaco" },
  { label: "Mongolie", value: "mongolie" },
  { label: "Monténégro", value: "montenegro" },
  { label: "Mozambique", value: "mozambique" },
  { label: "Namibie", value: "namibie" },
  { label: "Nauru", value: "nauru" },
  { label: "Népal", value: "nepal" },
  { label: "Nicaragua", value: "nicaragua" },
  { label: "Niger", value: "niger" },
  { label: "Nigéria", value: "nigeria" },
  { label: "Norvège", value: "norvege" },
  { label: "Nouvelle-Zélande", value: "nouvelle-zelande" },
  { label: "Oman", value: "oman" },
  { label: "Ouganda", value: "ouganda" },
  { label: "Ouzbékistan", value: "ouzbekistan" },
  { label: "Pakistan", value: "pakistan" },
  { label: "Palaos", value: "palaos" },
  { label: "Panama", value: "panama" },
  { label: "Papouasie-Nouvelle-Guinée", value: "papouasie-nouvelle-guinee" },
  { label: "Paraguay", value: "paraguay" },
  { label: "Pays-Bas", value: "pays-bas" },
  { label: "Pérou", value: "perou" },
  { label: "Philippines", value: "philippines" },
  { label: "Pologne", value: "pologne" },
  { label: "Portugal", value: "portugal" },
  { label: "Qatar", value: "qatar" },
  { label: "Roumanie", value: "roumanie" },
  { label: "Royaume-Uni", value: "royaume-uni" },
  { label: "Russie", value: "russie" },
  { label: "Rwanda", value: "rwanda" },
  { label: "Saint-Christophe-et-Niévès", value: "saint-christophe-et-nieves" },
  { label: "Saint-Marin", value: "saint-marin" },
  {
    label: "Saint-Vincent-et-les-Grenadines",
    value: "saint-vincent-et-les-grenadines",
  },
  { label: "Sainte-Lucie", value: "sainte-lucie" },
  { label: "Salomon", value: "salomon" },
  { label: "Salvador", value: "salvador" },
  { label: "Samoa", value: "samoa" },
  { label: "Sao Tomé-et-Principe", value: "sao-tome-et-principe" },
  { label: "Sénégal", value: "senegal" },
  { label: "Serbie", value: "serbie" },
  { label: "Seychelles", value: "seychelles" },
  { label: "Sierra Leone", value: "sierra-leone" },
  { label: "Singapour", value: "singapour" },
  { label: "Slovaquie", value: "slovaquie" },
  { label: "Slovénie", value: "slovenie" },
  { label: "Somalie", value: "somalie" },
  { label: "Soudan", value: "soudan" },
  { label: "Soudan du Sud", value: "soudan-du-sud" },
  { label: "Sri Lanka", value: "sri-lanka" },
  { label: "Suède", value: "suede" },
  { label: "Suisse", value: "suisse" },
  { label: "Suriname", value: "suriname" },
  { label: "Syrie", value: "syrie" },
  { label: "Tadjikistan", value: "tadjikistan" },
  { label: "Tanzanie", value: "tanzanie" },
  { label: "Tchad", value: "tchad" },
  { label: "Thaïlande", value: "thailande" },
  { label: "Timor oriental", value: "timor-oriental" },
  { label: "Togo", value: "togo" },
  { label: "Tonga", value: "tonga" },
  { label: "Trinité-et-Tobago", value: "trinite-et-tobago" },
  { label: "Tunisie", value: "tunisie" },
  { label: "Turkménistan", value: "turkmenistan" },
  { label: "Turquie", value: "turquie" },
  { label: "Tuvalu", value: "tuvalu" },
  { label: "Ukraine", value: "ukraine" },
  { label: "Uruguay", value: "uruguay" },
  { label: "Vanuatu", value: "vanuatu" },
  { label: "Vatican", value: "vatican" },
  { label: "Venezuela", value: "venezuela" },
  { label: "Vietnam", value: "vietnam" },
  { label: "Yémen", value: "yemen" },
  { label: "Zambie", value: "zambie" },
  { label: "Zimbabwe", value: "zimbabwe" },
];

export default function FormulaireContact({ params }) {
  const { id } = params;
  const router = useRouter();
  // const [nomComplet, setNomComplet] = useState(() => {
  //   const nom = session?.user?.nom || "";
  //   const prenom = session?.user?.prenom || "";
  //   return `${prenom} ${nom}`.trim();
  // });
  const [annonce, setAnnonce] = useState("");
  const [annonceId, setAnnonceId] = useState(id);
  const [userName, setUserName] = useState("");
  const [userPhoto, setUserPhoto] = useState("");
  const [userDate, setUserDate] = useState("");
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubCategory] = useState("");
  const [description, setDescription] = useState("");
  const [prix, setPrix] = useState("");
  const [typeTarif, setTypeTarif] = useState("");
  const [comments, setComments] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [adresse, setAdresse] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [ville, setVille] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [loading, setLoading] = useState(false);
  const tva = (prix * 0.1).toFixed(2);
  const total = (parseFloat(prix) + parseFloat(tva)).toFixed(2);


  useEffect(() => {
    async function fetchAnnonce() {
      try {
        const response = await fetch(`/api/annonce/id=${id}`);
        if (response.ok) {
          const data = await response.json();

          const userName = data.user
            ? `${data.user.prenom} ${data.user.nom}`
            : "Utilisateur non trouvé";
          const userPhoto =
            data.user?.profileImages && data.user.profileImages.length > 0
              ? data.user.profileImages[0]?.path
              : "/default-avatar.png";
          const userId = data.user ? `${data.user.id}` : "ID user non trouvé";
          const userCreatedAt = data.user?.createdAt;
          const userDate = userCreatedAt ? new Date(userCreatedAt) : null;
          const userEmail = data.user?.email;
          const userPhone = data.user?.phone;
          const formattedDate = userDate
            ? userDate.toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })
            : "Date inconnue";
          setAnnonce(data);
          setUserPhone(userPhone);
          setUserEmail(userEmail);
          setAnnonceId(data.id);
          setTitle(data.titre);
          setCategory(data.categorieAnnonce);
          setSubCategory(data.sousCategorie);
          setPrix(data.prix);
          setTypeTarif(data.typeTarif);
          setDescription(data.description);
          setAdresse(data.adresse);
          setUserName(userName);
          setUserDate(formattedDate);
          setUserPhoto(userPhoto);
          setUserId(userId);
        } else {
          console.error("Annonce non trouvée, avec l'id annonce :", id);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'annonce :", error);
      }
    }

    fetchAnnonce();
  }, [id]);

  useEffect(() => {
    if (annonceId) {
      async function fetchComments() {
        try {
          const response = await fetch(
            `/api/comments?annoncesId=${encodeURIComponent(annonceId)}`
          );
          if (response.ok) {
            const data = await response.json();
            const sortedComments = data.commentaires.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            setComments(sortedComments);
          } else {
            console.error("Erreur lors de la récupération des commentaires");
          }
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des commentaires :",
            error
          );
        }
      }

      fetchComments();
    }
  }, [annonceId]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <StarIcon
            key={i}
            className="h-5 w-5 fill-yellow-400 text-yellow-400"
          />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <div key={i} className="relative h-5 w-5">
            <StarIcon
              className="absolute h-full w-full fill-yellow-400 text-yellow-400"
              style={{ clipPath: "inset(0 0.5em 0 0)" }}
            />
            <StarIcon
              className="absolute h-full w-full fill-gray-400  text-gray-400"
              style={{ clipPath: "inset(0 0 0 0.5em)" }}
            />
          </div>
        );
      } else {
        stars.push(<StarIcon key={i} className="h-5 w-5 text-gray-400" />);
      }
    }
    return stars;
  };

  const calculateAverageRating = (comments) => {
    const ratedComments = comments.filter((comment) => comment.note != null);

    if (ratedComments.length === 0) return 0;

    const totalRating = ratedComments.reduce(
      (sum, comment) => sum + comment.note,
      0
    );

    return totalRating / ratedComments.length;
  };

  const averageRating = calculateAverageRating(comments);

  const handleSelectChange = (value) => {
    setSelectedCountry(value);
  };

  const handleCardClick = (annonceId) => {
    console.log("Annonce ID:", annonceId);
    router.push(`/Annonces/id=${annonceId}`);
  };

  const formatTypeTarif = (typeTarif) => {
    switch (typeTarif) {
      case "NUITEE":
        return "nuitée";
      case "JOURNALIER":
        return "journalier";
      case "MENSUEL":
        return "mensuel";
      case "FIXE":
        return "";
      default:
        return "";
    }
  };

  if (!annonce) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8 mb-8">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
          <p className="text-lg font-medium text-center">
            Chargement de l&apos;annonce en cours...
          </p>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Veuillez patienter quelques instants.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handlePayAnnonce = async (annonceId) => {
    try {
      const response = await fetch("/api/paiement/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          annonceId,
          userId,
          userName,
          userEmail,
          userPhone,
          ville,
          adresse,
          codePostal,
          selectedCountry,
          total,
          success_url: `${process.env.FRONTEND_URL}/succesPage/{CHECKOUT_SESSION_ID}`,
          cancelUrl: `${process.env.FRONTEND_URL}/cancel`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur inconnue");
      }

      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      );
      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (result.error) {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Erreur lors de la création de la session Stripe:", error);
    }
  };

  // <--

    const handleCheckout = async () => {
        const formData = new FormData()
        formData.append('priceId', annonce.priceId)
        formData.append('sellerId', annonce.user.id)

        const response = await fetch('/api/stripe/checkout', {
          method: 'POST',
          body: formData
        })

        const session = await response.json()
        router.push(session.checkoutSession.url)
    } 

  // -->

  return (
    <div className="container mx-auto py-10 px-20">
      <Button
        onClick={(e) => handleCardClick(annonceId)}
        className="py-5 text-[18px] rounded-[10px] space-x-3"
      >
        <FaArrowLeft className="ml-2 mr-4" />
        Retour
      </Button>

      <div className="flex flex-col lg:flex-row justify-center items-center   pt-10 pb-10 space-y-5 lg:space-y-0 lg:space-x-10 px-5">
        <Card className="w-full max-w-md lg:max-w-lg xl:max-w-2xl h-auto p-5 shadow-md rounded-lg flex-shrink-0">
          <CardHeader className="flex items-center justify-center">
            <CardTitle className="text-center text-3xl mb-2">
              Formulaire de réservation
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-5">
            <div className="grid w-full items-center gap-4">
              <div className="grid w-full items-center gap-2">
                <div className="w-full space-y-2">
                  <Label htmlFor="nomComplet">Nom complet</Label>
                  <Input
                    id="nomComplet"
                    name="nomComplet"
                    value={userName || ""}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-right text-[#425466] font-medium text-[16px]"
                  >
                    Votre adresse email
                  </Label>
                  <Input
                    id="email"
                    placeholder="email@gmail.com"
                    value={userEmail || ""}
                    required
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="num"
                    className="text-right text-[#425466] font-medium text-[16px]"
                  >
                    Votre numéro de téléphone
                  </Label>
                  <PhoneInput
                    country={"fr"}
                    value={userPhone || ""}
                    required
                    onChange={setUserPhone}
                    placeholder="Entrez votre numéro"
                    inputStyle={{ width: "100%", height: "40px" }}
                    buttonClass="custom-flag-style"
                    inputClass="col-span-3 items-start w-full bg-[#edf2f7] text-[15px] text-[#27272E] font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adresse">Adresse exacte</Label>
                  <Input
                    id="adresse"
                    name="adresse"
                    value={adresse}
                    onChange={(e) => setAdresse(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="codePostal">Code postal</Label>
                  <Input
                    id="codePostal"
                    name="codePostal"
                    value={codePostal}
                    onChange={(e) => setCodePostal(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ville">Ville</Label>
                  <Input
                    id="ville"
                    name="ville"
                    value={ville}
                    onChange={(e) => setVille(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pays">Pays</Label>
                  <Select
                    onValueChange={handleSelectChange}
                    value={selectedCountry}
                    placeholder="Sélectionnez un pays"
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un pays" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {PAYS.map((pays) => (
                        <SelectItem key={pays.value} value={pays.value}>
                          {pays.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full max-w-md lg:max-w-lg xl:max-w-2xl h-auto p-5 shadow-md rounded-lg flex-shrink-0">
          <CardHeader className="flex items-center justify-center">
            <CardTitle className="text-center text-3xl mb-2">
              Détails de l&apos;annonce à réserver
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-[#152447] hover:underline">
                {title}
              </CardTitle>

              <div className="flex space-x-1">{renderStars(averageRating)}</div>
            </div>
            <div className="flex items-start space-x-4 pt-4">
              <div className="pt-2">
                <Image
                  src={userPhoto}
                  alt="Photo de profil de l'utilisateur"
                  width={65}
                  height={65}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                />
              </div>

              <div className="flex flex-col p-0 space-y-1">
                <span className="text-[18px] font-bold text-[#666]">
                  {userName}
                </span>
                <span className="text-[16px] text-gray-500">
                  Membre depuis : {userDate}
                </span>
              </div>
            </div>
            <div className="flex flex-col pt-4 space-y-3">
              <div className="flex items-center space-x-3">
                <TagIcon className="text-blue-500 h-6 w-6" />
                <span className="font-semibold text-gray-700">
                  <strong>Catégorie:</strong> {category}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <TagIcon className="text-blue-500 h-6 w-6" />
                <span className="font-semibold text-gray-700">
                  <strong>Sous-catégorie:</strong> {subcategory}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <TagIcon className="h-6 w-6 text-blue-500" />
                <span className="font-semibold text-gray-700">
                  <strong>Prix :</strong> {prix} €
                  <span className="ml-1">{formatTypeTarif(typeTarif)}</span>
                </span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 pb-4 pt-8 items-center w-full">
            <Separator />
            <div className="w-full  p-6 space-y-4 bg-white rounded-lg shadow-sm">
              <div className="flex justify-between items-center text-base">
                <span>Sous total</span>
                <span>{prix} €</span>
              </div>
              <div className="flex justify-between items-center text-base text-muted-foreground">
                <span>TVA(10%)</span>
                <span>{tva} €</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t text-lg font-medium">
                <span>Totale:</span>
                <span>{total} €</span>
              </div>
            </div>
            <Button
              className="bg-[#0f172a] text-white py-2 rounded-lg w-full"
              // onClick={() => handlePayAnnonce(annonceId)}
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading
                ? "Traitement en cours..."
                : "Enregistrer les informations et payer l'article"}
            </Button>
            <Button
              variant="outline"
              className="w-full py-2 mb-4 mx-4 rounded-lg text-[#0f172a] hover:border-[#0f172a] hover:text-[#0f172a]"
              aria-label="Annuler l'action"
            >
              Annuler
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="container mx-auto flex items-center w-full pt-10 place-content-center">
        <Link href="/Annonces">
          <Button className="py-4 px-5 text-[20px]">
            <FaArrowRight className="mr-2" />
            Voir plus d&apos;annonces
          </Button>
        </Link>
      </div>
    </div>
  );
}
