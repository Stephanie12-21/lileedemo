"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/user/forgotPswrd/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("E-mail de réinitialisation envoyé avec succès !");
        setError("");
        console.log("ID utilisateur:", data.userId); // Afficher l'ID utilisateur si nécessaire
      } else {
        setError(data.error || "Une erreur s'est produite.");
        setMessage("");
      }
    } catch (error) {
      setError("Une erreur s'est produite.");
      setMessage("");
    }
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
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              Réinitialiser le mot de passe
            </h2>
            <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
              Veuillez saisir votre adresse email pour pouvoir réinitialiser
              votre mot de passe
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <Label htmlFor="email" className="sr-only">
                  Votre adresse email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="bg-white p-2 border border-gray-300 rounded"
                  placeholder="Adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {message && (
              <Alert variant="success">
                <AlertDescription className="text-green-600">
                  {message}
                </AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <Button
                onClick={handleSubmit}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-base font-medium rounded-md text-white  focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                Réinitialiser
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-base">
            <span className="text-gray-600 dark:text-gray-400">
              Vous êtes nouveau?{" "}
            </span>
            <Link
              href="/signup"
              className="font-medium text-[#15213d] focus:ring-[#15213d] dark:text-[#15213d] dark:hover:text-[#15213d] hover:underline"
            >
              Créer un compte
            </Link>
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
