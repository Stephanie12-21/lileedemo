// "use client";
// import AnimatedSymbol from "@/components/MainComponents/Sections/Loading/AnimatedSymbol";
// import { Badge } from "@/components/ui/badge";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";

// const InfoAnnonces = ({ params }) => {
//   const router = useRouter();
//   const { id } = params;
//   const { data: session } = useSession();
//   const [transaction, setTransaction] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!session) {
//       router.push("/login");
//     }
//   }, [session, router]);

//   useEffect(() => {
//     const fetchTransaction = async () => {
//       if (!id) return;

//       setLoading(true);
//       try {
//         const res = await fetch(`/api/transactions/${id}`);
//         const data = await res.json();

//         if (data) {
//           setTransaction(data);
//         }
//       } catch (error) {
//         console.error(
//           "Erreur lors de la récupération de la transaction :",
//           error
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTransaction();
//   }, [id]);

//   if (loading) {
//     return (
//       <div>
//         <AnimatedSymbol />
//       </div>
//     );
//   }

//   if (!transaction) {
//     return <p>Transaction non trouvée.</p>;
//   }

//   const {
//     annonceUserId: seller,
//     buyerUserId: buyer,
//     transactionStatus: status,
//     transactionDate,
//   } = transaction;

//   const formatStatus = (status) => {
//     switch (status) {
//       case "COMPLETED":
//         return "Succès";
//       case "FAILED":
//         return "Échec";
//       case "PENDING":
//         return "En attente";
//       default:
//         return status;
//     }
//   };

//   const formattedDate = `${transactionDate.substring(
//     0,
//     2
//   )}${transactionDate.substring(2, 4)}${transactionDate.substring(4, 8)}`;
//   const transactionRef = `REF${formattedDate}-${id}`;

//   return (
//     <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
//         <div className="flex justify-between items-center bg-primary p-6">
//           <h1 className="text-3xl font-bold text-white">{transactionRef}</h1>
//           <Badge variant="secondary" className="text-lg py-1 px-3">
//             {formatStatus(status)}
//           </Badge>
//         </div>

//         <div className="grid md:grid-cols-2 gap-8 p-6">
//           <div>
//             <p>Adresse de facturation du vendeur : {seller}</p>
//           </div>

//           <div className="space-y-6">
//             <p>Adresse de facturation de l&apos;acheteur : {buyer}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InfoAnnonces;

"use client";
import AnimatedSymbol from "@/components/MainComponents/Sections/Loading/AnimatedSymbol";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const InfoAnnonces = ({ params }) => {
  const router = useRouter();
  const { id } = params;
  const { data: session } = useSession();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push("/login");
    }
  }, [session, router]);

  useEffect(() => {
    const fetchTransaction = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const res = await fetch(`/api/transactions/${id}`);
        const data = await res.json();

        if (data) {
          setTransaction(data);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de la transaction :",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);

  if (loading) {
    return (
      <div>
        <AnimatedSymbol />
      </div>
    );
  }

  if (!transaction) {
    return <p>Transaction non trouvée.</p>;
  }

  const {
    annonceUserId: seller,
    buyerUserId: buyer,
    transactionStatus: status,
    transactionDate,
  } = transaction;

  const formatStatus = (status) => {
    switch (status) {
      case "COMPLETED":
        return "Succès";
      case "FAILED":
        return "Échec";
      case "PENDING":
        return "En attente";
      default:
        return status;
    }
  };

  const formattedDate = `${transactionDate.substring(
    0,
    2
  )}${transactionDate.substring(2, 4)}${transactionDate.substring(4, 8)}`;
  const transactionRef = `REF${formattedDate}-${id}`;

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="flex justify-between items-center bg-primary p-6">
          <h1 className="text-3xl font-bold text-white">{transactionRef}</h1>
          <Badge variant="secondary" className="text-lg py-1 px-3">
            {formatStatus(status)}
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-8 p-6">
          <div>
            <p>Adresse de facturation du vendeur : {seller}</p>
          </div>

          <div className="space-y-6">
            <p>Adresse de facturation de l&apos;acheteur : {buyer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoAnnonces;
