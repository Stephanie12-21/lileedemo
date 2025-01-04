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
import { AlertTriangle, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AnimatedSymbol from "@/components/MainComponents/Sections/Loading/AnimatedSymbol";

const PubPage = () => {
  const [raison, setRaison] = useState("");
  const [email, setEmail] = useState("");
  const [messageAlert, setMessageAlert] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isSuspendAlertOpen, setIsSuspendAlertOpen] = useState(false);
  const [isActivationAlertOpen, setIsActivationAlertOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userId, setUserId] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/user/getAll");
      const data = await response.json();
      const filteredUsers = data.users.filter((user) => user.role !== "ADMIN");
      setUsers(filteredUsers);
    } catch (error) {
      toast.error("Erreur lors de la récupération des utilisateurs :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchUsers();
  }, []);

  const filteredUsersData = useMemo(() => {
    const searchLower = searchFilter.toLowerCase();
    return users.filter((user) => {
      const matchesSearch =
        user.nom.toLowerCase().includes(searchLower) ||
        user.prenom.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.phone.toLowerCase().includes(searchLower);
      const matchesRole =
        roleFilter === "all" || user.role.toLowerCase() === roleFilter;
      const matchesStatus =
        statusFilter === "all" ||
        user.statutUser.toLowerCase() === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchFilter, roleFilter, statusFilter]);

  const handleSeeUserInfo = useCallback(
    (userId) => {
      router.push(`/admin/users/${userId}`);
    },
    [router]
  );

  const openAlert = (user) => {
    setSelectedUser(user);
    setEmail(user.email);
    setIsAlertOpen(true);
  };

  const openSuspendAlert = (user) => {
    setSelectedUser(user);
    setEmail(user.email);
    setUserId(user.id);
    setIsSuspendAlertOpen(true);
  };

  const openActivationAlert = (user) => {
    setSelectedUser(user);
    setEmail(user.email);
    setUserId(user.id);
    setIsActivationAlertOpen(true);
  };

  const handleConfirmAlertUser = async () => {
    if (!messageAlert) {
      toast.info("Veuillez entrer une raison pour la suspension.");
      return;
    }

    try {
      const response = await fetch("/api/user/alertUser", {
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
        toast.info("L'utilisateur a été alerté et informé par email.");
      } else {
        toast.error(
          data.error || "Une erreur s'est produite lors de la suspension."
        );
      }
    } catch (error) {
      toast.error("Une erreur s'est produite, veuillez réessayer:", error);
    } finally {
      setIsSuspendAlertOpen(false);
    }
  };

  const handleConfirmSuspendUser = async () => {
    if (!raison) {
      alert("Veuillez entrer une raison pour la suspension.");
      return;
    }

    const statutUser = "SUSPENDU";
    try {
      const response = await fetch(`/api/user/suspendUser/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          raison,
          statutUser,
          email,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.info("L'utilisateur a été suspendu et informé par email.");
        await fetchUsers();
      } else {
        alert(data.error || "Une erreur s'est produite lors de la suspension.");
      }
    } catch (error) {
      toast.error("Erreur lors de la suspension :", error);
    } finally {
      setIsSuspendAlertOpen(false);
    }
  };

  const handleConfirmActivationUser = async () => {
    const statutUser = "ACTIF";
    try {
      const response = await fetch(`/api/user/activationUser/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          statutUser,
          email,
        }),
      });

      if (!response.ok) {
        const textResponse = await response.text();
        toast.error("Erreur du serveur:", textResponse);
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
        "Le compte de l'utilisateur a été activé et l'utilisateur a été informé par email."
      );
      await fetchUsers();
    } catch (error) {
      toast.error("Erreur lors de l'activation :", error);
    } finally {
      setIsActivationAlertOpen(false);
    }
  };

  const columns = [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        const imageUrl = row.original.profileImages?.[0]?.path;
        return imageUrl ? (
          <Image
            src={imageUrl}
            alt="Profil"
            width={50}
            height={50}
            className="w-[50px] h-[50px] rounded-full object-cover"
          />
        ) : (
          "Pas d'image"
        );
      },
    },

    {
      accessorKey: "fullName",
      header: "Nom complet",
      cell: ({ row }) => `${row.original.nom} ${row.original.prenom}`,
    },

    { accessorKey: "email", header: "Adresse email" },

    { accessorKey: "phone", header: "Téléphone" },

    {
      accessorKey: "role",
      header: "Type de compte",
      cell: ({ row }) => {
        const role = row.original.role;

        const roleText = {
          PERSO: "particulier",
          PRO: "professionnel",
        };

        const statusColor = {
          PERSO: "bg-primary text-white hover:bg-primary hover:text-white",
          PRO: "bg-orange-100 text-orange-500 hover:bg-orange-100 hover:text-orange-500",
        };

        return (
          <Badge
            className={`px-3 py-[5px] rounded-full ${
              statusColor[role] || "bg-gray-100 text-gray-800"
            }`}
          >
            {roleText[role] || "Inconnu"}
          </Badge>
        );
      },
    },

    {
      accessorKey: "statutUser",
      header: "Statut",
      cell: ({ row }) => {
        const statut = row.original.statutUser;

        const statusText = {
          ACTIF: "actif",
          SUSPENDU: "suspendue",
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
                    onClick={() => handleSeeUserInfo(row.original.id)}
                  >
                    Voir le profil de l&apos;utilisateur
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Button
                    variant="outline"
                    onClick={() => openAlert(row.original)}
                  >
                    Avertir l&apos;utilisateur
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (row.original.statutUser === "ACTIF") {
                        openSuspendAlert(row.original);
                      } else if (row.original.statutUser === "SUSPENDU") {
                        openActivationAlert(row.original);
                      }
                    }}
                  >
                    {row.original.statutUser === "ACTIF"
                      ? "Suspendre le compte"
                      : "Activer le compte"}{" "}
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsersData.slice(startIndex, endIndex);
  }, [filteredUsersData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredUsersData.length / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading)
    return (
      <div>
        <AnimatedSymbol />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 text-base">
      <div className="container mx-auto px-7 pt-8 pb-0">
        <div className="flex justify-center items-center mb-2">
          <h1 className="text-4xl font-bold mb-8 text-center">
            Liste de toutes les annonces de LILEE
          </h1>
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 justify-between pt-8 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full max-w-full mx-auto">
            <div className="relative w-full md:w-2/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher ici ..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-2 border-primary/20 transition-colors bg-white"
              />
            </div>

            <div className="flex flex-row space-x-4 items-center w-full md:w-2/3">
              <Select
                value={roleFilter}
                onValueChange={(value) => setRoleFilter(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner le type de compte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="pro">Professionnel</SelectItem>
                    <SelectItem value="perso">Personnel</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner le statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="actif">Actif</SelectItem>
                    <SelectItem value="nonActif">Non actif</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="pt-7">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-center align-middle"
                    >
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
                    <TableCell
                      key={cell.id}
                      className="text-center align-middle"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between items-center mt-20">
          <Button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded disabled"
          >
            Précédent
          </Button>
          <span>
            Page {currentPage} sur {totalPages}
          </span>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2  rounded disabled"
          >
            Suivant
          </Button>
        </div>

        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogContent className="w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
            <AlertDialogTitle className="flex flex-col items-center space-y-3 text-center text-2xl">
              <AlertTriangle className="h-16 w-16 text-yellow-500" />
              <span>Avertir l&apos;utilisateur</span>
            </AlertDialogTitle>

            <div className="mt-4">
              <Label
                htmlFor="email"
                className="block text-[16px] font-medium mb-2"
              >
                Email de l&apos;utilisateur concerné :
              </Label>
              <Input
                id="email"
                type="text"
                placeholder="email de l'utilisateur"
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
                Message adressé à l&apos;utilisateur :
              </Label>
              <Textarea
                id="raison"
                placeholder="Ecrire un message ..."
                value={messageAlert}
                onChange={(e) => setMessageAlert(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex flex-col items-center w-full space-y-3 mt-6">
              <AlertDialogAction
                className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 py-2 rounded-md"
                onClick={handleConfirmAlertUser}
              >
                Suspendre l&apos;annonce
              </AlertDialogAction>
              <AlertDialogCancel className="w-full text-center text-primary hover:underline">
                Annuler
              </AlertDialogCancel>
            </div>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog
          open={isSuspendAlertOpen}
          onOpenChange={setIsSuspendAlertOpen}
        >
          <AlertDialogContent className="w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
            <AlertDialogTitle className="flex flex-col items-center space-y-3 text-center text-2xl">
              <AlertTriangle className="h-16 w-16 text-yellow-500" />
              <span>Confirmation de suspension</span>
            </AlertDialogTitle>

            <div className="mt-4">
              <Label
                htmlFor="email"
                className="block text-[16px] font-medium mb-2"
              >
                Email de l&apos;utilisateur concerné :
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
                Raison de la suspension :
              </Label>
              <Textarea
                id="raison"
                placeholder="Expliquez pourquoi cet utilisateur est suspendu..."
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

        <AlertDialog
          open={isActivationAlertOpen}
          onOpenChange={setIsActivationAlertOpen}
        >
          <AlertDialogContent className="w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
            <AlertDialogTitle className="text-center text-lg sm:text-xl font-semibold">
              Êtes-vous sûr d&apos;activer ce compte utilisateur ?
            </AlertDialogTitle>

            <div className="mt-4 space-y-2 text-sm sm:text-base text-gray-700">
              <p>
                En activant ce compte, vous allez permettre à cet utilisateur de
                se connecter à votre application.
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
      </div>
    </div>
  );
};

export default PubPage;
