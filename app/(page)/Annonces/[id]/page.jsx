"use client";

import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowRight,
  DeleteIcon,
  EditIcon,
  Loader2,
  MapIcon,
  MapPin,
  MoreHorizontal,
  StarIcon,
  TagIcon,
  X,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import StarRatingDialog from "@/app/(dialog)/note/page";
import ConfirmDeleteModal from "@/app/(dialog)/delete/page";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Input } from "@/components/ui/input";
import { toast, ToastContainer } from "react-toastify";

const InfoAnnonces = ({ params }) => {
  const { id } = params;
  const { data: session } = useSession();
  const [annonceId, setAnnonceId] = useState("");
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
  const [images, setImages] = useState([]);
  const [localisation, setLocalisation] = useState("");
  const [adresse, setAdresse] = useState("");
  const [iframeSrc, setIframeSrc] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [showModalRating, setShowModalRating] = useState(false);
  const [note, setNote] = useState("");
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setLightboxOpen] = useState(false);
  const [annonce, setAnnonce] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const remainingImages = images.slice(4);
  const remainingCount = remainingImages.length;

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!comment) {
      alert("Vous n'avez écrit aucun commentaire");
      return;
    } else if (!session) {
      toast.info(
        "Vous devez vous connecter à votre compte pour pouvoir publier des commentaires"
      );
      return;
    }

    const formData = new FormData();
    formData.append("IdAnnonce", annonceId);
    formData.append("IdUser", session.user.id);
    formData.append("Commentaire", comment);

    try {
      const response = await fetch("/api/comments/", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const currentTime = new Date().toISOString();
        setComment("");
        setComments((prevComments) => [
          {
            user: session.user,
            commentaire: comment,
            createdAt: currentTime,
          },
          ...prevComments,
        ]);
      } else {
        console.log("Erreur lors de la publication du commentaire.");
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleEditComment = (commentItem) => {
    setEditCommentId(commentItem.id);
    setEditCommentText(commentItem.commentaire);
  };

  const handleUpdateComment = async () => {
    if (!editCommentText) {
      alert("Vous devez entrer un commentaire.");
      return;
    }

    if (!editCommentId) {
      alert("ID du commentaire manquant.");
      return;
    }

    const formData = new FormData();
    formData.append("IdCommentaire", editCommentId);
    formData.append("Commentaire", editCommentText);

    try {
      const response = await fetch(`/api/comments/${editCommentId}/`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === parseInt(editCommentId, 10)
              ? {
                  ...comment,
                  commentaire: editCommentText,
                  updatedAt: new Date().toISOString(),
                }
              : comment
          )
        );
        setEditCommentId(null);
        setEditCommentText("");
        toast.success("Commentaire mis à jour avec succès.");
      } else {
        const errorData = await response.json();
        toast.error(
          `Erreur lors de la mise à jour du commentaire: ${errorData.message}`
        );
      }
    } catch (error) {
      toast.error("Erreur:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditCommentId(null);
    setEditCommentText("");
  };

  const handleDeleteClick = (commentItem) => {
    setSelectedCommentId(commentItem.id);
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setSelectedCommentId(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCommentId) {
      console.log("ID de commentaire manquant");
      return;
    }
    try {
      const response = await fetch(`/api/comments/${selectedCommentId}/`, {
        method: "DELETE",
      });

      if (response.ok) {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== selectedCommentId)
        );
        toast.success("Commentaire supprimé avec succès.");
      } else {
        const errorData = await response.json();
        toast.error(
          `Erreur lors de la suppression du commentaire: ${errorData.message}`
        );
      }
    } catch (error) {
      toast.error("Erreur:", error);
    } finally {
      handleCloseModal();
    }
  };

  const handleRating = (commentItem) => {
    setShowModalRating(true);
    setNote(commentItem.note);
    const note = commentItem.note || 0;
    setSelectedCommentId(commentItem.id);
    const commentId = `${commentItem.id}`;
  };

  const handleCloseRatingModal = () => {
    setShowModalRating(false);
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

  useEffect(() => {
    async function fetchAnnonce() {
      try {
        const response = await fetch(`/api/annonce/${id}`);
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

          const formattedDate = userDate
            ? userDate.toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })
            : "Date inconnue";
          setAnnonce(data);
          setAnnonceId(data.id);
          setTitle(data.titre);
          setCategory(data.categorieAnnonce);
          setSubCategory(data.sousCategorie);
          setPrix(data.prix);
          setTypeTarif(data.typeTarif);
          setDescription(data.description);
          setAdresse(data.adresse);
          setLocalisation(data.localisation);
          setImages(data.imageAnnonces);
          setUserName(userName);
          setUserDate(formattedDate);
          setUserPhoto(userPhoto);
          setUserId(userId);
          if (data.localisation) setIframeSrc(data.localisation);
        } else {
          console.error("Annonce non trouvée, avec l'id annonce :", id);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'annonce :", error);
      }
    }

    fetchAnnonce();
  }, [id]);

  const getRolePath = () => {
    const role = session?.user?.role;
    const userId = session?.user?.id;
    if (role === "PERSO") return `/personnel/messages/${userId}`;
    if (role === "PRO") return `/professionel/messages/${userId}`;
    if (role === "ADMIN") return `/admin/messages/${userId}`;
    return "";
  };

  const handleChat = () => {
    if (session && session.user) {
      const rolePath = getRolePath();

      if (rolePath) {
        router.push(rolePath);
      } else {
        console.error("Rôle non défini pour cet utilisateur");
      }
    } else {
      router.push("/login");
    }
  };

  const handlePayment = (annonceId) => {
    console.log("Payment initiated for annonce:", annonceId);
    router.push(`/Annonces/confirmreservation/${annonceId}`);
  };

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
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

  return (
    <div className="container mx-auto py-10 px-4 md:px-20">
      <Link href="/Annonces">
        <Button className="py-5 text-base md:text-[18px] rounded-[10px] space-x-3">
          <FaArrowLeft className="ml-2 mr-2" />
          Retour
        </Button>
      </Link>
      <div className="pt-10 pb-10 flex flex-col md:flex-row items-start space-x-0 md:space-x-20">
        <div className="relative w-full md:w-auto">
          {images[0]?.path && (
            <div>
              <Image
                src={images[0].path}
                alt="Image principale"
                width={800}
                height={600}
                style={{
                  maxWidth: "100%",
                  maxHeight: "400px",
                  objectFit: "cover",
                  cursor: "pointer",
                  borderRadius: "10px",
                }}
                onClick={() => openLightbox(0)}
              />
            </div>
          )}

          <div className="mt-4 flex space-x-4 justify-center md:space-x-10">
            {images.slice(1, 4).map((image, index) => (
              <div
                key={index}
                className="cursor-pointer"
                onClick={() => openLightbox(index + 1)}
              >
                <Image
                  src={image.path}
                  alt={`Image ${index + 1}`}
                  width={200}
                  height={150}
                  style={{
                    width: "200px",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </div>
            ))}
            {images.length > 4 && (
              <div className="text-center text-sm text-gray-500 mt-4">
                <div
                  className="bg-gray-200 inline-block py-2 px-4 rounded-full cursor-pointer"
                  onClick={() => openLightbox(4)}
                >
                  <span>
                    + {images.length - 4} image
                    {images.length - 4 > 1 ? "s" : ""} restante
                    {images.length - 4 > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            )}
          </div>

          {isLightboxOpen && (
            <div
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50"
              style={{
                backdropFilter: "blur(10px)",
              }}
            >
              <Swiper
                spaceBetween={20}
                slidesPerView={1}
                className="w-full max-w-3xl"
                initialSlide={currentIndex}
                onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
              >
                {images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <Image
                      src={image.path}
                      alt={`Image ${index + 1}`}
                      width={1200}
                      height={900}
                      style={{
                        maxWidth: "90%",
                        maxHeight: "90vh",
                        objectFit: "contain",
                        borderRadius: "10px",
                        margin: "auto",
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              <button
                className="absolute top-4 right-4 hover:bg-[#9B9B9B] text-white p-2 rounded-full"
                onClick={() => setLightboxOpen(false)}
              >
                <X />
              </button>
            </div>
          )}
        </div>

        <div className="w-full md:w-[50%] mt-6 md:mt-0">
          <Card className="w-full min-w-[360px] space-y-6 flex flex-col shadow-lg rounded-lg bg-white p-2 sm:p-3 md:p-4 lg:p-6 hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="flex flex-col space-y-4">
              <div className="flex items-center justify-between flex-wrap">
                <CardTitle className="text-base sm:text-xl md:text-xl font-bold text-[#152447] hover:underline">
                  {title}
                </CardTitle>
                <div className="flex space-x-1">
                  {renderStars(averageRating)}
                </div>
              </div>
              <CardDescription className="text-[#141414] font-medium text-base sm:text-sm md:text-base lg:text-lg space-y-4">
                <div
                  className="leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      description.length > 100
                        ? description.substring(0, 100).replace(/^"|"$/g, "") +
                          "..."
                        : description.replace(/^"|"$/g, ""),
                  }}
                />
                <div className="flex items-start space-x-3 pt-4">
                  <Image
                    src={userPhoto}
                    alt="Photo de profil de l'utilisateur"
                    width={50}
                    height={50}
                    className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-gray-300"
                  />
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm sm:text-base md:text-lg font-bold text-[#666]">
                      {userName}
                    </span>
                    <span className="text-xs sm:text-sm md:text-base text-gray-500">
                      Membre depuis : {userDate}
                    </span>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>

            <CardFooter className="flex flex-col justify-center space-y-2 sm:space-y-3 md:space-y-4 mt-4 w-full">
              {session && session.user ? (
                <>
                  <Button
                    variant="default"
                    className="text-white text-wrap text-xs sm:text-sm md:text-base lg:text-base py-2 px-3 sm:px-4 md:px-5 lg:px-6 w-full rounded-md sm:rounded-lg md:rounded-xl shadow hover:shadow-lg transition-all"
                    onClick={handleChat}
                  >
                    Discuter
                  </Button>
                  <Button
                    variant="default"
                    className="text-white text-xs sm:text-sm md:text-base lg:text-base py-2 px-3 sm:px-4 md:px-5 lg:px-6 w-full rounded-md sm:rounded-lg md:rounded-xl shadow hover:shadow-lg transition-all"
                    onClick={() => handlePayment(annonceId)}
                  >
                    Réserver
                  </Button>
                </>
              ) : (
                <Button
                  className="bg-gray-300 text-[#353945] text-xs sm:text-sm md:text-base lg:text-base py-2 px-3 sm:px-4 md:px-5 lg:px-6 w-full rounded-md sm:rounded-lg md:rounded-xl shadow hover:bg-gray-400 transition-all"
                  onClick={() => router.push("/login")}
                >
                  Se connecter
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="flex items-start w-full pt-10">
        <Tabs defaultValue="description" className="relative w-full">
          <TabsList className="relative flex md:space-x-20 space-x-2 justify-center px-5">
            <TabsTrigger
              value="description"
              className="relative py-2 px-1 md:px-4 text-sm md:text-base font-medium"
            >
              Description
            </TabsTrigger>
            <TabsTrigger
              value="avis"
              className="relative py-2 px-4 text-sm md:text-base font-medium"
            >
              Avis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description">
            <Card className="border-none bg-white p-6">
              <CardContent className="space-y-7">
                <div className="space-y-4 pb-4">
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
                <div className="space-y-1 ">
                  <h1 className="text-3xl font-bold my-8 text-start">
                    Description de l&apos;annonce
                  </h1>
                  <div
                    className="container px-5"
                    dangerouslySetInnerHTML={{
                      __html: description.replace(/^"|"$/g, ""),
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="avis">
            <Card className="border-none bg-white p-6">
              <CardHeader className="space-y-4">
                <CardTitle className="text-4xl font-bold mb-8 text-center">
                  Laissez un avis
                </CardTitle>
                <CardDescription className="text-base font-medium ">
                  Exprimez-vous, commentez et déposez un avis. Partagez vos
                  expériences avec les autres.
                </CardDescription>
              </CardHeader>
              {/* <CardContent className="space-y-2">
                <div className="mb-6 flex justify-between items-center space-x-3">
                  <Input
                    type="text"
                    placeholder="Exprimez-vous..."
                    className="border border-gray-300 p-2 w-full rounded-lg"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Button
                    className="py-4 px-5 text-base rounded-lg relative"
                    onClick={handlePublish}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    Publier
                    <motion.div
                      className="inline-block ml-2"
                      animate={{
                        x: isHovered ? 5 : 0,
                        opacity: isHovered ? 1 : 0.7,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </Button>
                </div>

                <div className="flex justify-between pt-7">
                  <span className="font-semibold">
                    {comments.length} commentaire
                    {comments.length > 1 ? "s" : ""}
                  </span>
                </div>

                {comments.map((commentItem, index) => {
                  const isSameUser =
                    String(commentItem.user.id) === String(session?.user?.id);

                  return (
                    <div key={index} className="flex justify-between pt-8 pr-7">
                      <div className="flex space-x-5 border border-grey w-full p-2 rounded-lg">
                        <div>
                          <Avatar>
                            <AvatarImage
                              src={
                                commentItem.user.profileImage ||
                                "https://github.com/shadcn.png"
                              }
                              alt={commentItem.user.nom}
                            />
                            <AvatarFallback>Photo</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="space-y-3 flex-grow">
                          <div className="flex justify-between items-center">
                            <span className="text-[#182135] font-bold text-[18px] hover:underline hover:cursor-default">
                              {commentItem.user.nom} {commentItem.user.prenom}
                            </span>

                            {isSameUser && (
                              <DropdownMenu>
                                <DropdownMenuTrigger>
                                  <Button variant="outline" className="text-xl">
                                    <MoreHorizontal className="w-8 h-8" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuPortal>
                                  <DropdownMenuContent>
                                    <DropdownMenuGroup>
                                      <DropdownMenuItem>
                                        <Button
                                          variant="link"
                                          className="flex items-center"
                                          onClick={() =>
                                            handleEditComment(commentItem)
                                          }
                                        >
                                          <EditIcon className="mr-2 h-4 w-4" />
                                          Modifier
                                        </Button>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <Button
                                          variant="link"
                                          className="flex items-center"
                                          onClick={() =>
                                            handleDeleteClick(commentItem)
                                          }
                                        >
                                          <DeleteIcon className="mr-2 h-4 w-4" />
                                          Supprimer
                                        </Button>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <Button
                                          variant="link"
                                          className="flex items-center"
                                          onClick={() =>
                                            handleRating(commentItem)
                                          }
                                        >
                                          <StarIcon className="mr-2 h-4 w-4" />
                                          Notes
                                        </Button>
                                      </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                  </DropdownMenuContent>
                                </DropdownMenuPortal>
                              </DropdownMenu>
                            )}
                          </div>

                          {editCommentId === commentItem.id ? (
                            <Textarea
                              type="text"
                              value={editCommentText}
                              onChange={(e) =>
                                setEditCommentText(e.target.value)
                              }
                              className="border border-gray-300 p-2 w-full rounded-lg"
                            />
                          ) : (
                            <p>{commentItem.commentaire}</p>
                          )}

                          <div className="flex justify-between items-center pt-4">
                            {!editCommentId && (
                              <>
                                {commentItem.updatedAt &&
                                commentItem.updatedAt ===
                                  commentItem.createdAt ? (
                                  <span className="text-sm text-gray-500">
                                    {" "}
                                    {new Date(
                                      commentItem.createdAt
                                    ).toLocaleDateString()}{" "}
                                    à{" "}
                                    {new Date(
                                      commentItem.createdAt
                                    ).toLocaleTimeString(undefined, {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                ) : (
                                  commentItem.updatedAt && (
                                    <span className="text-sm text-gray-500">
                                      {" "}
                                      {new Date(
                                        commentItem.updatedAt
                                      ).toLocaleDateString()}{" "}
                                      à{" "}
                                      {new Date(
                                        commentItem.updatedAt
                                      ).toLocaleTimeString(undefined, {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  )
                                )}
                              </>
                            )}
                            <div>
                              {commentItem.note && (
                                <div className="flex space-x-1">
                                  {renderStars(commentItem.note)}
                                </div>
                              )}
                            </div>
                          </div>

                          {editCommentId === commentItem.id && (
                            <div className="flex space-x-4">
                              <Button onClick={handleUpdateComment}>
                                Mettre à jour
                              </Button>
                              <Button
                                variant="outline"
                                onClick={handleCancelEdit}
                              >
                                Annuler
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent> */}
              <CardContent className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0">
                  <Input
                    type="text"
                    placeholder="Exprimez-vous..."
                    className="border border-gray-300 p-2 w-full rounded-lg"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Button
                    className="py-4 px-5 text-base rounded-lg relative w-full sm:w-auto"
                    onClick={handlePublish}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    Publier
                    <motion.div
                      className="inline-block ml-2"
                      animate={{
                        x: isHovered ? 5 : 0,
                        opacity: isHovered ? 1 : 0.7,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="pt-10 space-y-5">
        <div className="container mx-auto flex items-center w-full pt-10 place-content-center">
          <Link href="/Annonces">
            <Button className="py-4 px-5 text-[17px] rounded-[10px]">
              Voir plus d&apos;annonces
              <FaArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
      <StarRatingDialog
        isOpen={showModalRating}
        annonceId={annonceId}
        onClose={handleCloseRatingModal}
        commentId={selectedCommentId}
        currentRating={note}
      />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
      />
    </div>
  );
};

export default InfoAnnonces;
