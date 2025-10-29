"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CalendarIcon, Loader2, StarIcon, TagIcon } from "lucide-react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function FormulaireContact({ params }) {
  const { data: session } = useSession();
  const [date, setDate] = useState("");
  const { id } = params;
  const router = useRouter();
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
  const [typeTarif, setTypeTarif] = useState("");
  const [comments, setComments] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [adresse, setAdresse] = useState("");

  const [loading, setLoading] = useState(false);

  const [prixUnitaire, setPrixUnitaire] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [prix, setPrix] = useState(0);
  const [tva, setTva] = useState(0);
  const [total, setTotal] = useState(0);

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
          const fetchedPrixUnitaire = data.prix; // Récupération du prix unitaire depuis l'API
          setPrixUnitaire(fetchedPrixUnitaire);

          const initialPrix = fetchedPrixUnitaire * quantity; // Calcul du sous-total
          setPrix(initialPrix);

          const calculatedTva = initialPrix * 0.1; // Calcul de la TVA
          setTva(calculatedTva);

          const calculatedTotal = initialPrix + calculatedTva; // Calcul du total
          setTotal(calculatedTotal);
          setCategory(data.categorieAnnonce);
          setSubCategory(data.sousCategorie);
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
  }, [id, quantity]);

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

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center  min-h-screen bg-gray-100">
        <Card className="w-full max-w-md p-4">
          <CardHeader>
            <CardTitle className="text-2xl text-primary font-bold text-center">
              Connexion requise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-6 text-gray-600">
              Veuillez vous connecter à votre compte pour continuer
            </p>
            <div className="flex justify-center">
              <Button asChild className="w-full">
                <Link href="/login">Se connecter</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // <--
  // const handleCheckout = async () => {
  //   if (!session) {
  //     console.error("Session not initialized!");
  //     return;
  //   }

  //   const buyerId = session.user.id;
  //   const formData = new FormData();
  //   formData.append("date", date);
  //   formData.append("annonceId", annonce.id);
  //   formData.append("priceId", annonce.priceId);
  //   formData.append("sellerId", annonce.user.id);
  //   formData.append("buyerId", buyerId);
  //   formData.append("title", annonce.titre);
  //   formData.append("quantity", quantity);

  //   try {
  //     const response = await fetch("/api/stripe/checkout", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (!response.ok) {
  //       throw new Error(
  //         `Failed to create checkout session: ${response.statusText}`
  //       );
  //     }

  //     const checkoutSession = await response.json();
  //     if (checkoutSession?.checkoutSession?.url) {
  //       router.push(checkoutSession.checkoutSession.url);
  //     } else {
  //       console.error("Checkout session URL not found!");
  //     }
  //   } catch (error) {
  //     console.error("An error occurred during checkout:", error);
  //   }
  // };
  const handleCheckout = async () => {
    if (!session) {
      alert("Vous devez être connecté pour continuer");
      return;
    }

    // ✅ Empêcher plusieurs clics
    setLoading(true);

    try {
      // ✅ Vérification des dates
      if (!date?.from || !date?.to) {
        alert("Veuillez choisir une date de début et une date de fin");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("from", new Date(date.from).toISOString());
      formData.append("to", new Date(date.to).toISOString());
      formData.append("annonceId", annonce.id);
      formData.append("priceId", annonce.priceId);
      formData.append("sellerId", annonce.user.id);
      formData.append("buyerId", session.user.id);
      formData.append("title", annonce.titre);
      formData.append("quantity", quantity);

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Stripe error:", errorText);
        alert("Erreur de paiement. Vérifiez le serveur Stripe.");
        return;
      }

      const data = await response.json();
      if (data?.checkoutSession?.url) {
        window.location.href = data.checkoutSession.url;
      } else {
        alert("Erreur: URL de paiement introuvable.");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur inattendue lors du paiement.");
    } finally {
      setLoading(false);
    }
  };

  // -->

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10) || 1;
    setQuantity(newQuantity);

    const newPrix = parseFloat(prixUnitaire) * newQuantity;
    const newTva = newPrix * 0.1;
    const newTotal = newPrix + newTva;

    setPrix(newPrix);
    setTva(newTva);
    setTotal(newTotal);
  };

  return (
    <div className="container mx-auto py-10 px-10">
      <div className="flex flex-col lg:flex-row justify-center items-center  space-y-5 lg:space-y-0 lg:space-x-10 px-10">
        <Card className="w-full max-w-md lg:max-w-lg xl:max-w-2xl h-auto p-2 shadow-md rounded-lg flex-shrink-0">
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
                <TagIcon className="text-blue-500 h-6 w-6" />
                <span className="font-semibold text-gray-700">
                  <strong>Adresse:</strong> {adresse}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <TagIcon className="h-6 w-6 text-blue-500" />
                <span className="font-semibold text-gray-700">
                  <strong>Prix :</strong> {prixUnitaire} €
                  <span className="ml-1">{formatTypeTarif(typeTarif)}</span>
                </span>
              </div>
              <div className="space-y-2 p-2 font-semibold">
                <Label htmlFor="quantity" className="text-gray-700">
                  Durée de la réservation:
                </Label>

                <div className="relative flex-1">
                  <CalendarIcon className="text-[#15213d] w-5 h-5 absolute left-2 top-1/2 transform -translate-y-1/2" />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant="outline"
                        className={cn(
                          "w-full justify-start pl-10 text-left font-normal",
                          !date && "text-white"
                        )}
                      >
                        {date?.from ? (
                          date.to ? (
                            <>
                              {format(date.from, "dd MMM yyyy", { locale: fr })}{" "}
                              - {format(date.to, "dd MMM yyyy", { locale: fr })}
                            </>
                          ) : (
                            format(date.from, "dd MMM yyyy", { locale: fr })
                          )
                        ) : (
                          <span className="text-gray-700">Quand</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="space-y-2 p-2 font-semibold">
                <Label htmlFor="quantity" className="text-gray-700">
                  Quantité (nombre d&apos;unités) :
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  className="border rounded p-2"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 pb-4 pt-4 items-center w-full">
            <Separator />
            <div className="w-full  p-6 space-y-4 bg-white rounded-lg shadow-sm">
              <div className="flex justify-between items-center text-base">
                <span>Sous total</span>
                <span>{parseFloat(prix).toFixed(2)} €</span>{" "}
              </div>
              <div className="flex justify-between items-center text-base text-muted-foreground">
                <span>TVA(10%)</span>
                <span>{parseFloat(tva).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t text-lg font-medium">
                <span>Totale:</span>
                <span>{parseFloat(total).toFixed(2)} €</span>
              </div>
            </div>
            <Button
              className="bg-[#0f172a] text-white py-2 rounded-lg w-full"
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
          <Button className="py-4 px-5 text-base">
            <FaArrowRight className="mr-2" />
            Voir plus d&apos;annonces
          </Button>
        </Link>
      </div>
    </div>
  );
}
