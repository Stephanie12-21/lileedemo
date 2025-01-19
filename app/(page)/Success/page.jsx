"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const SuccessPage = () => {
  const router = useRouter();

  const handleReturnToHome = () => {
    router.push("/Annonces");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-green-100 animate-pulse" />
              <CheckCircle className="relative w-16 h-16 text-[#15213d] animate-bounce" />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-gray-900 animate-fade-in">
              Félicitations !
            </h2>

            <p className="mt-2 text-gray-600">
              L&apos;opération a été effectuée avec succès
            </p>

            <div className="my-6 w-16 h-1 bg-[#15213d] rounded-full" />

            <Button
              onClick={handleReturnToHome}
              className="w-full mt-4 bg-[#15213d] text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Retour à l&apos;accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuccessPage;
