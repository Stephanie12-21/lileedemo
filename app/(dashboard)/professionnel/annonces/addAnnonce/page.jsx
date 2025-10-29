"use client";

import RichTextEditor from "@/components/MainComponents/TextEditor/RichEditor";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Asterisk, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { SuccessModal } from "@/app/(dialog)/success/SuccessModal";
import { ErrorModal } from "@/app/(dialog)/error/ErrorModal";
import AnimatedSymbol from "@/components/MainComponents/Sections/Loading/AnimatedSymbol";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const AddAnnonce = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [prix, setPrix] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [description, setDescription] = useState({});
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [adresse, setAdresse] = useState("");
  const [tarifType, setTarifType] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setSubCategory("");
    setAdresse("");
    setImages([]);
    setErrors({});
  };

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...selectedImages]);
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !title ||
      !description ||
      !category ||
      !subCategory ||
      !adresse ||
      !prix ||
      !tarifType ||
      images.length === 0
    ) {
      alert(
        "Tous les champs doivent être remplis et au moins une image doit être uploadée."
      );
      return;
    }
    const statut = "EN_ATTENTE_DE_VALIDATION";
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", JSON.stringify(description));
    formData.append("category", category);
    formData.append("subcategory", subCategory);
    formData.append("adresse", adresse);
    formData.append("statut", statut);
    formData.append("userId", session?.user.id);
    formData.append("prix", prix);
    formData.append("tarifType", tarifType);

    if (images.length > 0) {
      images.forEach((image) => {
        formData.append("images", image);
      });
    }

    try {
      const response = await fetch("/api/annonce/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout de l'annonce");
      }

      const result = await response.json();

      // <-- create a new stripe product and price

      const productFormData = new FormData();
      productFormData.append("id", result.Annonce.id);

      await fetch("/api/stripe/product/", {
        method: "POST",
        body: productFormData,
      });

      // -->

      setIsSuccessModalOpen(true);

      resetForm();

      setTimeout(() => {
        router.push(`/personnel/annonces/`);
      }, 2000);
    } catch (error) {
      setIsErrorModalOpen(true);
      console.error("Erreur :", error);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#15213d]">
        <AnimatedSymbol />
      </div>
    );
  }

  const categoriesWithSubcategories = {
    IMMOBILIER: [
      "Location PMR",
      "Appartement PMR",
      "Camping PMR",
      "Chambre d'hôtes PMR",
      "Hôtel PMR",
    ],
    VOITURE: ["Conduite accompagnée", " Équipée d'une rampe"],
    VETEMENT: ["Femme", "Homme", "Enfant"],
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Ajouter une nouvelle annonce
      </h1>
      <div className="flex flex-col space-y-4 w-full mt-5">
        <div className="space-y-3">
          <Label htmlFor="title">Titre:</Label>
          <Input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            error={errors.title}
          />
          {errors.title && <Alert variant="error">{errors.title}</Alert>}
        </div>

        <div className="flex flex-col lg:flex-row w-full space-x-0 lg:space-x-2">
          <div className="w-full space-y-3">
            <Label htmlFor="category">Catégorie:</Label>
            <Select
              className="w-full"
              onValueChange={(value) => {
                setCategory(value);
                setSubCategory("");
              }}
            >
              <SelectTrigger className="w-full px-4">
                <SelectValue
                  placeholder="Sélectionner une catégorie"
                  className="flex items-start"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="IMMOBILIER">Immobilier</SelectItem>
                  <SelectItem value="VETEMENT">Vêtements</SelectItem>
                  <SelectItem value="EMPLOI_SERVICE">
                    Emplois / Recrutement / Services
                  </SelectItem>
                  <SelectItem value="VOITURE">Voitures</SelectItem>
                  <SelectItem value="LOISIR">Loisir</SelectItem>
                  <SelectItem value="MATERIEL">
                    Matériels / Equipements
                  </SelectItem>
                  <SelectItem value="MOBILIER">Mobilier</SelectItem>
                  <SelectItem value="DONS">Dons</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.category && (
              <Alert variant="error">{errors.category}</Alert>
            )}
          </div>

          <div className="w-full space-y-3 mt-2 lg:mt-0 ">
            <Label htmlFor="subCategory">Sous-catégorie:</Label>
            {categoriesWithSubcategories[category] ? (
              <Select
                className="w-full"
                onValueChange={(value) => setSubCategory(value)}
              >
                <SelectTrigger className="w-full px-4">
                  <SelectValue
                    placeholder="Sélectionner une sous-catégorie"
                    className="flex items-start"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categoriesWithSubcategories[category].map((sub, index) => (
                      <SelectItem key={index} value={sub}>
                        {sub}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            ) : (
              <Input
                type="text"
                id="subCategory"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                placeholder="Entrez une sous-catégorie"
              />
            )}
            {errors.subCategory && (
              <Alert variant="error">{errors.subCategory}</Alert>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row w-full space-x-0 lg:space-x-10">
          <div className="space-y-3 w-full">
            <Label htmlFor="prix">Prix:</Label>
            <Input
              type="number"
              id="prix"
              value={prix}
              onChange={(e) => setPrix(e.target.value)}
              required
              error={errors.prix}
            />
            {errors.prix && <Alert variant="error">{errors.prix}</Alert>}
          </div>

          <div className="w-full">
            <Label htmlFor="tarifType">Type de tarif:</Label>
            <RadioGroup value={tarifType} onValueChange={setTarifType}>
              <div className="flex items-center space-x-6 mt-3">
                <div>
                  <RadioGroupItem id="tarifJournalier" value="JOURNALIER" />
                  <Label htmlFor="tarifJournalier" className="ml-2">
                    Tarif journalier
                  </Label>
                </div>

                <div>
                  <RadioGroupItem id="tarifNuitee" value="NUITEE" />
                  <Label htmlFor="tarifNuitee" className="ml-2">
                    Tarif nuitée
                  </Label>
                </div>

                <div>
                  <RadioGroupItem id="tarifFixe" value="FIXE" />
                  <Label htmlFor="tarifFixe" className="ml-2">
                    Tarif fixe
                  </Label>
                </div>
                <div>
                  <RadioGroupItem id="tarifMensuel" value="MENSUEL" />
                  <Label htmlFor="tarifFixe" className="ml-2">
                    Tarif mensuel
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="description">Description:</Label>
          <RichTextEditor
            content={description}
            onChange={(json) => setDescription(json)}
          />
          {errors.description && (
            <Alert variant="error">{errors.description}</Alert>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="adresse">Adresse exacte:</Label>
          <Input
            type="text"
            id="adresse"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            required
            error={errors.adresse}
          />
          {errors.adresse && <Alert variant="error">{errors.adresse}</Alert>}
        </div>

        <div className="space-y-3">
          <Label htmlFor="images">Images:</Label>
          <Input
            type="file"
            id="images"
            onChange={handleImageChange}
            accept="image/*"
            multiple
          />
          <div className="flex space-x-4 mt-4">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <Image
                  src={URL.createObjectURL(image)}
                  alt={`preview-${index}`}
                  width={200}
                  height={200}
                  className="w-32 h-32 object-cover rounded"
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  onClick={() => handleRemoveImage(index)}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={handleSubmit}>Ajouter l&apos;annonce</Button>
      </div>

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

export default AddAnnonce;
