"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [userId, setUserId] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchTokenAndVerify = async () => {
      // Extraire le token depuis l'URL
      const urlSearchParams = new URLSearchParams(window.location.search);
      const token = urlSearchParams.get("token"); // Déclaré localement dans l'effet

      if (!token) return;

      try {
        const response = await fetch("/api/user/verifToken/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();
        if (response.ok) {
          setIsTokenValid(true);
          setUserId(data.userId);
        } else {
          setError(
            data.error ||
              "Le lien de réinitialisation est invalide ou a expiré."
          );
        }
      } catch (err) {
        setError("Erreur lors de la vérification du lien de réinitialisation.");
      }
    };

    fetchTokenAndVerify();
  }, []); // Pas de dépendances nécessaires

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await fetch(`/api/user/resetPswrd/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess("Votre mot de passe a été réinitialisé avec succès.");
        router.push("/login");
      } else {
        setError(
          data.message ||
            "Une erreur est survenue lors de la réinitialisation du mot de passe."
        );
      }
    } catch (err) {
      setError("Erreur lors de la réinitialisation du mot de passe.");
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleCancelResetPassword = () => {
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen ">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Image
              src="/assets/logo.svg"
              width={150}
              height={100}
              alt="Logo Lilee"
              className="mx-auto h-24 w-auto"
            />
            <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
              Veuillez saisir votre nouveau mot de passe et confirmer pour le
              réinitialiser
            </p>
          </div>
          <div className="mt-8 space-y-6">
            {error && <p style={{ color: "red" }}>{error}</p>}
            {isTokenValid && (
              <div className="rounded-md shadow-sm space-y-4">
                {success && <p style={{ color: "green" }}>{success}</p>}
                <div className="grid gap-2 ">
                  <div className="space-y-6 relative pt-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="password"
                        className="text-right font-medium text-[16px]"
                      >
                        Votre nouveau mot de passe
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={isPasswordVisible ? "text" : "password"}
                          placeholder="*******"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="bg-white p-2 border border-gray-300 rounded"
                          required
                        />
                        <div
                          className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                          onClick={togglePasswordVisibility}
                        >
                          {isPasswordVisible ? (
                            <Eye className="w-5 h-5 text-gray-600" />
                          ) : (
                            <EyeOff className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmpassword"
                        className="text-right font-medium text-[16px]"
                      >
                        Confirmer votre nouveau mot de passe
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmpassword"
                          type={isPasswordVisible ? "text" : "password"}
                          placeholder="*******"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="bg-white p-2 border border-gray-300 rounded"
                          required
                        />
                        <div
                          className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                          onClick={togglePasswordVisibility}
                        >
                          {isPasswordVisible ? (
                            <Eye className="w-5 h-5 text-gray-600" />
                          ) : (
                            <EyeOff className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    <Button
                      onClick={handleResetPassword}
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-base font-medium rounded-md text-white  focus:outline-none focus:ring-2 focus:ring-offset-2"
                    >
                      Réinitialiser le mot de passe
                    </Button>
                    <Button
                      onClick={handleCancelResetPassword}
                      variant="secondary"
                      className="w-full  hover:border hover:border-slate-900  "
                    >
                      Annuler l&apos;opération
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src="/assets/marcus-aurelius.jpg"
          alt="Marcus Aurelius"
          layout="fill"
        />
      </div>
    </div>
  );
}
