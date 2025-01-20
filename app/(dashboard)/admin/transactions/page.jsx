"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AnimatedSymbol from "@/components/MainComponents/Sections/Loading/AnimatedSymbol";

const PubPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/transactions");
      const data = await response.json();

      console.log("Toutes les données :", data);

      setUsers(data);
    } catch (error) {
      toast.error("Erreur lors de la récupération :", error.message);
      console.error("Erreur :", error);
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
      const createdAt = new Date(user.createdAt);
      const formattedDate = `${createdAt
        .getDate()
        .toString()
        .padStart(2, "0")}${(createdAt.getMonth() + 1)
        .toString()
        .padStart(2, "0")}${createdAt.getFullYear()}`;
      const reference = `REF${formattedDate}-${user.id}`;

      const matchesSearch =
        user.annonce?.titre?.toLowerCase().includes(searchLower) ||
        false ||
        user.annonce?.user?.prenom?.toLowerCase().includes(searchLower) ||
        false ||
        user.annonce?.user?.nom?.toLowerCase().includes(searchLower) ||
        false ||
        reference.toLowerCase().includes(searchLower);

      const matchesStatus =
        statusFilter === "all" ||
        user.status?.toLowerCase() === statusFilter.toLowerCase() ||
        false;

      return matchesSearch && matchesStatus;
    });
  }, [users, searchFilter, statusFilter]);

  const columns = [
    {
      accessorKey: "id",
      header: "Référence",
      cell: ({ row }) => {
        const createdAt = new Date(row.original.createdAt);
        const formattedDate = `${createdAt
          .getDate()
          .toString()
          .padStart(2, "0")}${(createdAt.getMonth() + 1)
          .toString()
          .padStart(2, "0")}${createdAt.getFullYear()}`;
        return `REF${formattedDate}-${row.original.id}`;
      },
    },
    {
      accessorKey: "annonceTitle",
      header: "Titre de l'annonce",
      cell: ({ row }) => `${row.original.annonce.titre}`,
    },
    {
      accessorKey: "sellerName",
      header: "Vendeur",
      cell: ({ row }) =>
        `${row.original.annonce.user.prenom} ${row.original.annonce.user.nom}`,
    },
    {
      accessorKey: "buyerName",
      header: "Acheteur",
      cell: ({ row }) => `${row.original.user.prenom} ${row.original.user.nom}`,
    },

    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => {
        const price = parseFloat(row.original.price);
        const quantity = parseInt(row.original.quantity, 10);
        const total = price * quantity;
        return `${total.toFixed(2)} €`;
      },
    },

    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => {
        const statut = row.original.status;

        const statusText = {
          COMPLETED: "succès",
          FAILED: "échec",
          PENDING: "en attente",
        };

        const statusColor = {
          COMPLETED: "bg-green-100 text-green-800 hover:bg-green-200",
          FAILED: "bg-red-100 text-red-800 hover:bg-red-200",
          PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
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
                    Voir les détails de la transaction
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const handleSeeUserInfo = useCallback(
    (userId) => {
      router.push(`/admin/transactions/${userId}`);
    },
    [router]
  );

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsersData.slice(startIndex, endIndex);
  }, [filteredUsersData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(users.length / itemsPerPage);

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
            Liste de toutes les transactions effectuées sur Lilee
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
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner le statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="COMPLETED">Succès</SelectItem>
                    <SelectItem value="FAILED">Échec</SelectItem>
                    <SelectItem value="PENDING">En attente</SelectItem>
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
