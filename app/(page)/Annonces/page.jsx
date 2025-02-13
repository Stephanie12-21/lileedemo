"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Loader2, Search } from "lucide-react";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

const cardVariants = {
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
    },
  }),
  hidden: (i) => ({
    opacity: 0,
    y: 50,
    transition: {
      delay: i * 0.01,
      duration: 0.3,
    },
  }),
};

export default function Annonces() {
  const [annonces, setAnnonces] = useState([]);
  const [date, setDate] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("IMMOBILIER");
  const [isFavorited, setIsFavorited] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [likedAnnonces, setLikedAnnonces] = useState([]);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [tarifFilter, setTarifFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const fetchAnnonces = async () => {
    try {
      const response = await fetch("/api/annonce/getAll");
      const data = await response.json();
      console.log("données reçues:", data);

      const filteredData = data
        .filter(
          (annonce) =>
            annonce.statut !== "DESACTIVEE" &&
            annonce.statut !== "EN_ATTENTE_DE_VALIDATION"
        )

        .map((annonce) => {
          const notes = annonce.commentaire
            .map((c) => c.note)
            .filter((note) => note !== null);

          if (notes.length > 0) {
            const total = notes.reduce((acc, note) => acc + note, 0);
            const average = total / notes.length;

            annonce.averageNote = average;
          } else {
            annonce.averageNote = 0;
          }

          return annonce;
        });

      setAnnonces(filteredData);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnonces();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const userId = session?.user?.id;
        if (userId) {
          const response = await fetch("/api/favorites", {
            method: "GET",
            headers: {
              userId: userId,
            },
          });

          if (!response.ok) {
            throw new Error("Erreur lors de la récupération des favoris");
          }

          const favorisIds = await response.json();
          setLikedAnnonces(favorisIds);

          setIsFavorited(favorisIds.includes(annonces.id));
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des favoris :", error);
        toast.error("Erreur lors de la récupération des favoris.");
      }
    };

    fetchFavorites();
  }, [annonces.id, session?.user?.id]);

  const toggleHeart = async (id) => {
    const userId = session?.user?.id;

    if (!userId) {
      toast.error("Vous devez être connecté pour ajouter aux favoris.");
      return;
    }

    try {
      if (likedAnnonces.includes(id)) {
        const updatedFavorites = likedAnnonces.filter((favId) => favId !== id);
        setLikedAnnonces(updatedFavorites);
        setIsFavorited(false);

        await removeFromFavorites(userId, id);
        toast.info("Annonce retirée des favoris.");
      } else {
        const updatedFavorites = [...likedAnnonces, id];
        setLikedAnnonces(updatedFavorites);
        setIsFavorited(true);

        await addToFavorites(userId, id);
        toast.success("Annonce ajoutée aux favoris.");
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour des favoris.");
    }
  };

  const addToFavorites = async (userId, annonceId) => {
    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, annonceId }),
      });

      if (!response.ok) throw new Error("Erreur lors de l'ajout aux favoris");
    } catch (error) {
      console.error("Erreur lors de l'ajout aux favoris:", error);
      throw error;
    }
  };

  const removeFromFavorites = async (userId, annonceId) => {
    try {
      const response = await fetch("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, annonceId }),
      });

      if (!response.ok) throw new Error("Erreur lors du retrait des favoris");
    } catch (error) {
      console.error("Erreur lors du retrait des favoris:", error);
      throw error;
    }
  };

  const filteredAnnonces = annonces.filter((annonce) => {
    const matchesCategory =
      activeTab === "" || annonce.categorieAnnonce === activeTab;

    const matchesSearch =
      searchText === "" ||
      annonce.titre.toLowerCase().includes(searchText.toLowerCase()) ||
      annonce.adresse.toLowerCase().includes(searchText.toLowerCase()) ||
      annonce.user.nom?.toLowerCase().includes(searchText.toLowerCase()) ||
      annonce.user.prenom?.toLowerCase().includes(searchText.toLowerCase());

    if (tarifFilter === "all") return true;

    const matchesTarifFilter =
      !tarifFilter || annonce.typeTarif === tarifFilter;

    const matchesRatingFilter =
      !ratingFilter || annonce.averageNote >= parseInt(ratingFilter);

    const matchesDateRange =
      !date?.from ||
      !date?.to ||
      (new Date(annonce.createdAt) >= date.from &&
        new Date(annonce.createdAt) <= date.to);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesTarifFilter &&
      matchesRatingFilter &&
      matchesDateRange
    );
  });

  const tabItems = [
    { value: "IMMOBILIER", label: "Logement" },
    { value: "EMPLOI_SERVICE", label: "Emploi & Service" },
    { value: "VOITURE", label: "Voiture" },
    { value: "LOISIR", label: "Loisir" },
    { value: "MATERIEL", label: "Matériel" },
    { value: "DONS", label: "Donations" },
    { value: "VETEMENT", label: "Vêtement" },
    { value: "MOBILIER", label: "Mobilier" },
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const starOptions = [
    { value: "5", label: "5 étoiles" },
    { value: "4", label: "4 étoiles" },
    { value: "3", label: "3 étoiles" },
    { value: "2", label: "2 étoiles" },
    { value: "1", label: "1 étoile" },
    { value: "0", label: "0 étoile" },
  ];

  const renderStars = (count) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => {
          const isFilled = index < count;
          return (
            <svg
              key={index}
              xmlns="http://www.w3.org/2000/svg"
              fill={isFilled ? "gold" : "none"}
              stroke={isFilled ? "none" : "gold"}
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 17.27l6.18 3.73-1.64-7.03L21 9.24l-7.19-.61L12 2 10.19 8.63 3 9.24l5.46 4.73L6.82 21z"
              />
            </svg>
          );
        })}
      </div>
    );
  };

  const handleCardClick = (annonceId) => {
    router.push(`/Annonces/id=${annonceId}`);
  };

  if (loading) {
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

  return (
    <div className="w-full py-9 px-6">
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 justify-between pt-8 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full max-w-full mx-auto">
          <div className="relative w-full md:w-2/4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher ici ..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border-2 border-primary/20 transition-colors bg-white"
            />
          </div>

          <div className="relative flex flex-wrap items-center gap-4 w-full md:w-2/4">
            <div className="flex-1 w-full">
              <Select value={tarifFilter} onValueChange={setTarifFilter}>
                <SelectTrigger className="w-full pr-2">
                  <SelectValue placeholder="Choisir le type de tarification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Tout</SelectItem>
                    <SelectItem value="JOURNALIER">Journalier</SelectItem>
                    <SelectItem value="NUITEE">Nuitée</SelectItem>
                    <SelectItem value="FIXE">Fixe</SelectItem>
                    <SelectItem value="MENSUEL">Mensuel</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 w-full">
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisir une note" />
                </SelectTrigger>
                <SelectContent>
                  {starOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {renderStars(Number(option.value))}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full md:w-2/5">
            <div className="flex-1 relative">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant="default"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-white"
                    )}
                  >
                    <CalendarIcon />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "dd MMM yyyy", { locale: fr })} -{" "}
                          {format(date.to, "dd MMM yyyy", { locale: fr })}
                        </>
                      ) : (
                        format(date.from, "dd MMM yyyy", { locale: fr })
                      )
                    ) : (
                      <span>Sélectionner la date</span>
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
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {isMobile ? (
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="w-full p-3 mb-4 border rounded-lg"
          >
            {tabItems.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        ) : (
          <TabsList className="flex space-x-4 justify-between px-5 ">
            {tabItems.map((item) => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className="relative py-2 px-4 text-base font-medium"
              >
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        )}

        {tabItems.map((item) => {
          const filteredByCategory = filteredAnnonces.filter(
            (annonce) => annonce.categorieAnnonce === item.value
          );

          const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
          const endIndex = startIndex + ITEMS_PER_PAGE;
          const paginatedAnnonces = filteredByCategory.slice(
            startIndex,
            endIndex
          );

          const totalPages = Math.ceil(
            filteredByCategory.length / ITEMS_PER_PAGE
          );

          return (
            <TabsContent
              key={item.value}
              value={item.value}
              className="mx-auto"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-10 mx-4 md:mx-10">
                {paginatedAnnonces.length === 0 && annonces.length === 0 ? (
                  <Label>Aucune annonce disponible.</Label>
                ) : (
                  paginatedAnnonces.map((annonce, index) => (
                    <motion.div
                      key={annonce.id}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      variants={cardVariants}
                    >
                      <Card
                        className="w-full overflow-hidden cursor-pointer relative"
                        onClick={() => handleCardClick(annonce.id)}
                      >
                        <div className="relative">
                          {annonce.imageAnnonces.length > 0 && (
                            <Image
                              src={annonce.imageAnnonces[0].path}
                              alt={annonce.titre}
                              width={400}
                              height={300}
                              className="w-full h-48 object-cover transform scale-100 hover:scale-105 transition-transform duration-300 ease-in-out"
                            />
                          )}
                          {/* <div className="absolute top-0 left-0 z-10 bg-[#FFA500] text-white px-4 py-1 rounded-br-lg transform -skew-x-12">
                            <span className="block transform skew-x-12">
                              Populaire
                            </span>
                          </div> */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleHeart(annonce.id);
                            }}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-600"
                          >
                            {likedAnnonces.includes(annonce.id) ? (
                              <AiFillHeart size={28} color="#FC1111" />
                            ) : (
                              <AiOutlineHeart size={28} color="#FC1111" />
                            )}
                          </button>
                        </div>
                        <CardContent className="p-4">
                          <Badge
                            variant="secondary"
                            className="text-base text-muted-foreground mb-1"
                          >
                            {annonce.sousCategorie}
                          </Badge>
                          <h2 className="text-lg font-semibold mb-1">
                            {annonce.titre}
                          </h2>
                          <p className="text-sm text-muted-foreground mb-2">
                            {annonce.user.nom} {annonce.user.prenom}
                          </p>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex justify-between items-center">
                          <Label
                            htmlFor="prix"
                            className="text-xl text-[gold] flex items-center"
                          >
                            <span>{annonce.prix} €</span>
                            <span className="ml-1">
                              {annonce.typeTarif === "NUITEE"
                                ? "nuitée"
                                : annonce.typeTarif === "JOURNALIER"
                                ? "journalier"
                                : annonce.typeTarif === "MENSUEL"
                                ? "mensuel"
                                : annonce.typeTarif === "FIXE"
                                ? "fixe"
                                : ""}
                            </span>
                          </Label>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className="w-4 h-4"
                                fill={
                                  i < Math.round(annonce.averageNote)
                                    ? "gold"
                                    : "none"
                                }
                                stroke="gold"
                                strokeWidth="1.5"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                />
                              </svg>
                            ))}
                          </div>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>

              {filteredByCategory.length > ITEMS_PER_PAGE && (
                <div className="flex justify-center items-center mt-10">
                  <Button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2  disabled"
                  >
                    Précédent
                  </Button>
                  <span className="px-4">{`Page ${currentPage} sur ${totalPages}`}</span>
                  <Button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2  disabled"
                  >
                    Suivant
                  </Button>
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
      />
    </div>
  );
}
