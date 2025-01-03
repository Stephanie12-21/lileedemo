"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FaEllipsisH } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { AlertTriangle, Search, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

import ConfirmDeleteModal from "@/app/(dialog)/delete/page";
import AnimatedSymbol from "@/components/MainComponents/Sections/Loading/AnimatedSymbol";

const UserPage = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [raison, setRaison] = useState("");
  const [email, setEmail] = useState("");
  const [nomMarque, setNomMarque] = useState("");
  const [messageAlert, setMessageAlert] = useState("");
  const [publicite, setPublicite] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isSuspendAlertOpen, setIsSuspendAlertOpen] = useState(false);
  const [isActivationAlertOpen, setIsActivationAlertOpen] = useState(false);
  const [selectedPub, setSelectedPub] = useState(null);
  const [pubId, setPubId] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();

  const fetchPartenaires = async () => {
    try {
      const response = await fetch("/api/partenaire/");
      const data = await response.json();
      setPublicite(data);
      setNomMarque(data.nom);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchPartenaires();
  }, []);

  const filteredPubsData = useMemo(() => {
    if (!Array.isArray(publicite)) {
      console.error(
        "publicite n'est pas un tableau ou est indéfini:",
        publicite
      );
      return [];
    }

    const searchLower = searchFilter.toLowerCase();

    return publicite.filter((pub) => {
      const matchesSearch =
        (pub.nom && pub.nom.toLowerCase().includes(searchLower)) ||
        (pub.email && pub.email.toLowerCase().includes(searchLower)) ||
        (pub.phone && pub.phone.toLowerCase().includes(searchLower)) ||
        (pub.adresse && pub.adresse.toLowerCase().includes(searchLower));

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "actif" && pub.statutPartenaire === "ACTIF") ||
        (statusFilter === "nonActif" && pub.statutPartenaire === "SUSPENDU");

      return matchesSearch && matchesStatus;
    });
  }, [publicite, searchFilter, statusFilter]);

  const handleSeePubInfo = useCallback(
    (pubId) => {
      console.log("ID du pub sélectionné :", pubId);
      router.push(`/admin/partenaire/${pubId}`);
    },
    [router]
  );

  const handleDeletePubInfo = (id) => {
    setSelectedPub(id);
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setSelectedPub(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPub) return;

    try {
      const response = await fetch(`/api/partenaire/${selectedPub}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'annonce");
      }

      setPublicite((prevPubs) =>
        prevPubs.filter((partenaire) => partenaire.id !== selectedPub)
      );
      toast.success("Données supprimées avec succès.");
    } catch (error) {
      console.error("Erreur lors de la suppression des données :", error);
    } finally {
      setShowDeleteModal(false);
      setSelectedPub(null);
    }
  };

  const handleEditPubInfo = useCallback(
    (pubId) => {
      console.log("ID du pub sélectionné :", pubId);
      router.push(`/admin/partenaire/editPartenaire/${pubId}`);
    },
    [router]
  );

  const openAlert = (publicite) => {
    setSelectedPub(publicite);
    setEmail(publicite.email);
    setIsAlertOpen(true);
  };

  const openSuspendAlert = (publicite) => {
    setSelectedPub(publicite);
    setEmail(publicite.email);
    setPubId(publicite.id);
    setIsSuspendAlertOpen(true);
  };

  const openActivationAlert = (publicite) => {
    setSelectedPub(publicite);
    setEmail(publicite.email);
    setNomMarque(publicite.nom);
    setPubId(publicite.id);
    setIsActivationAlertOpen(true);
  };

  const handleConfirmAlertPub = async () => {
    if (!messageAlert) {
      alert("Veuillez entrer une raison pour la suspension.");
      return;
    }

    try {
      const response = await fetch("/api/partenaire/alertPartenaire", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          messageAlert,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(
          "La publicité a été suspendue et  la marque a été informée par email.",
          {
            onClose: () => {
              setRaison("");
            },
          }
        );
      } else {
        alert(data.error || "Une erreur s'est produite lors de la suspension.");
      }
    } catch (error) {
      console.error("Erreur lors de la suspension :", error);
      alert("Une erreur s'est produite, veuillez réessayer.");
    } finally {
      setIsSuspendAlertOpen(false);
    }
  };

  const handleConfirmSuspendUser = async () => {
    if (!raison) {
      toast.info("Veuillez entrer une raison pour la suspension.", {
        onClose: () => {},
      });
      return;
    }

    const statutPartenaire = "SUSPENDU";
    try {
      const response = await fetch(
        `/api/partenaire/suspendPartenaire/${pubId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            raison,
            statutPartenaire,
            email,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success(
          "Publicité suspendue avec succès!La marque a été avertie par email.",
          {
            onClose: () => {
              setRaison(" ");
            },
          }
        );
        await fetchPartenaires();
      } else {
        alert(data.error || "Une erreur s'est produite lors de la suspension.");
      }
    } catch (error) {
      console.error("Erreur lors de la suspension :", error);
      alert("Une erreur s'est produite, veuillez réessayer.");
    } finally {
      setIsSuspendAlertOpen(false);
    }
  };

  const handleConfirmActivationUser = async () => {
    const statutPartenaire = "ACTIF";
    try {
      const response = await fetch(
        `/api/partenaire/activationPartenaire/${pubId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            statutPartenaire,
            email,
          }),
        }
      );

      if (!response.ok) {
        const textResponse = await response.text();
        console.error("Erreur du serveur:", textResponse);
        throw new Error(textResponse || "Une erreur s'est produite");
      }

      const data = await response.json();

      if (data.error) {
        toast.error(
          data.error || "Une erreur s'est produite lors de l'activation."
        );
        return;
      }

      toast.success(
        "Publicité activée avec succès! La marque a été avertie par email.",
        {
          onClose: () => {},
        }
      );
      await fetchPartenaires();
    } catch (error) {
      console.error("Erreur lors de l'activation :", error);
    } finally {
      setIsActivationAlertOpen(false);
    }
  };

  const columns = [
    {
      accessorKey: "logo",
      header: "Logo",
      cell: ({ row }) => {
        const imageUrl = row.original.logo?.[0]?.path;
        return imageUrl ? (
          <div className="flex justify-center">
            <Image
              src={imageUrl}
              alt="Profil"
              width={50}
              height={50}
              className="w-[50px] h-[50px]  rounded-full object-cover"
            />
          </div>
        ) : (
          "Pas d'image"
        );
      },
    },
    { accessorKey: "nom", header: "Dénomination" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: " Numéro de téléphone" },
    { accessorKey: "adresse", header: "Adresse" },

    {
      accessorKey: "statutPartenaire",
      header: "Statut",
      cell: ({ row }) => {
        const statut = row.original.statutPartenaire;

        const statusText = {
          ACTIF: "actif",
          SUSPENDU: "suspendu",
        };

        const statusColor = {
          ACTIF: "bg-primary text-white hover:bg-primary hover:text-white",
          SUSPENDU:
            "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800",
        };

        return (
          <Badge
            className={`px-3 py-[5px] rounded-full ${
              statusColor[statut] || "bg-gray-100 text-gray-800"
            }`}
          >
            {statusText[statut] || "Inconnu"}
          </Badge>
        );
      },
    },

    {
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-fit h-fit p-0">
                  <FaEllipsisH className="cursor-pointer" size={24} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-fit p-2 mt-2">
                <DropdownMenuItem>
                  <Button
                    variant="outline"
                    onClick={() => handleSeePubInfo(row.original.id)}
                  >
                    Voir les informations
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Button
                    variant="outline"
                    onClick={() => openAlert(row.original)}
                  >
                    Avertir la marque
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (row.original.statutPartenaire === "ACTIF") {
                        openSuspendAlert(row.original);
                      } else if (row.original.statutPartenaire === "SUSPENDU") {
                        openActivationAlert(row.original);
                      }
                    }}
                  >
                    {row.original.statutPartenaire === "ACTIF"
                      ? "Suspendre la publicité"
                      : "Activer la publicité"}{" "}
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Button
                    variant="outline"
                    onClick={() => handleEditPubInfo(row.original.id)}
                  >
                    Modifier les données
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Button
                    variant="outline"
                    onClick={() => handleDeletePubInfo(row.original.id)}
                  >
                    Supprimer les données
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredPubsData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen ">
        <AnimatedSymbol />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Liste de toutes les publicités de LILEE
      </h1>

      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 justify-between pt-8 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full max-w-full mx-auto">
          <div className="relative w-full md:w-3/4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher ici ..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border-2 border-primary/20 transition-colors bg-white rounded-md"
            />
          </div>
          <div className="relative flex flex-wrap items-center gap-4 w-full md:w-2/4">
            <div className="flex-1 w-full">
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner le statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    <SelectItem value="actif">Actif</SelectItem>
                    <SelectItem value="nonActif">Suspendu</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full md:w-2/5">
            <div className="flex-1 relative w-full">
              <Link href="/admin/partenaire/addPartenaire">
                <Button className="w-full md:w-auto">
                  <UsersRound className="mr-2 h-4 w-4" />
                  Ajouter un nouveau partenaire
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-7">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* avertir la marque */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <AlertDialogTitle className="flex flex-col items-center space-y-3 text-center text-2xl">
            <AlertTriangle className="h-16 w-16 text-yellow-500" />
            <span>Avertir le partenaire</span>
          </AlertDialogTitle>

          <div className="mt-4">
            <Label
              htmlFor="email"
              className="block text-[16px] font-medium mb-2"
            >
              Email du partenaire concerné :
            </Label>
            <Input
              id="email"
              type="text"
              placeholder="Rechercher une annonce"
              value={email}
              className="w-full text-black text-[16px] font-bold"
              disabled
            />
          </div>

          <div className="mt-4">
            <Label
              htmlFor="raison"
              className="block text-[16px] font-medium mb-2"
            >
              Raison de l&apos;avertissement :
            </Label>
            <Textarea
              id="message"
              placeholder="Écrire un message ..."
              value={messageAlert}
              onChange={(e) => setMessageAlert(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex flex-col items-center w-full space-y-3 mt-6">
            <AlertDialogAction
              className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 py-2 rounded-md"
              onClick={handleConfirmAlertPub}
            >
              Avertir le partenaire
            </AlertDialogAction>
            <AlertDialogCancel className="w-full text-center text-primary hover:underline">
              Annuler
            </AlertDialogCancel>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* suspendre la marque */}
      <AlertDialog
        open={isSuspendAlertOpen}
        onOpenChange={setIsSuspendAlertOpen}
      >
        <AlertDialogContent className="w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <AlertDialogTitle className="flex flex-col items-center space-y-3 text-center text-2xl">
            <AlertTriangle className="h-16 w-16 text-yellow-500" />
            <span>Suspendre le partenaire</span>
          </AlertDialogTitle>

          <div className="mt-4">
            <Label
              htmlFor="email"
              className="block text-[16px] font-medium mb-2"
            >
              Email du partenaire concerné :
            </Label>
            <Input
              id="email"
              type="text"
              placeholder="Rechercher une annonce"
              value={email}
              className="w-full text-black text-[16px] font-bold"
              disabled
            />
          </div>

          <div className="mt-4">
            <Label
              htmlFor="raison"
              className="block text-[16px] font-medium mb-2"
            >
              Raison de l&apos;avertissement :
            </Label>
            <Textarea
              id="message"
              placeholder="Écrire un message ..."
              value={raison}
              onChange={(e) => setRaison(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex flex-col items-center w-full space-y-3 mt-6">
            <AlertDialogAction
              className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 py-2 rounded-md"
              onClick={handleConfirmSuspendUser}
            >
              Suspendre l&apos;annonce
            </AlertDialogAction>
            <AlertDialogCancel className="w-full text-center text-primary hover:underline">
              Annuler
            </AlertDialogCancel>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* activer le partenaire */}
      <AlertDialog
        open={isActivationAlertOpen}
        onOpenChange={setIsActivationAlertOpen}
      >
        <AlertDialogContent className="w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <AlertDialogTitle className="text-center text-lg sm:text-xl font-semibold">
            Êtes-vous sûr d&apos;activer cette publicité de ce partenaire?
          </AlertDialogTitle>

          <div className="mt-4 space-y-2 text-sm sm:text-base text-gray-700">
            <p>
              En activant cette publicité, vous allez permettre à tous les
              utilisateurs de la plate-forme de consulter cette publicité.
            </p>
          </div>

          <div className="flex w-full justify-end space-x-3 mt-6">
            <AlertDialogCancel className="px-4 py-2 w-full text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmActivationUser}
              className="px-4 py-2 bg-primary w-full text-white rounded-md hover:bg-primary/90"
            >
              Activer
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
      />
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default UserPage;
