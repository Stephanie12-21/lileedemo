"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Unsubscribe = () => {
  const router = useRouter();

  useEffect(() => {
    const handleUnsubscribe = async () => {
      const urlSearchParams = new URLSearchParams(window.location.search);
      const token = urlSearchParams.get("token");

      if (!token) return;

      try {
        const response = await fetch(
          `/api/newsletter/unsubscribe?token=${token}`,
          {
            method: "GET",
          }
        );

        if (response.ok) {
          setTimeout(() => {
            router.push("/");
          }, 3000);
        } else {
          console.error("Erreur lors du désabonnement");
        }
      } catch (error) {
        console.error("Erreur réseau :", error);
      }
    };

    handleUnsubscribe();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-500 animate-pulse" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Désabonnement confirmé
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600">
            Vous n&apos;êtes plus abonné à la newsletter de Lilee.
          </p>
          <p className="mt-2 text-center text-sm text-gray-500">
            Vous allez être redirigé vers la page d&apos;accueil dans quelques
            secondes.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/">
            <Button className="px-20 py-3 bg-[#15213d] text-white text-base rounded-lg">
              Retour à l&apos;accueil
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Unsubscribe;
