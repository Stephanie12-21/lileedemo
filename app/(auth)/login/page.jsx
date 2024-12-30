"use client";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { getSession, signIn } from "next-auth/react";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const emailLoginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit comporter au moins 8 caractères"),
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleSubmit = async () => {
    try {
      emailLoginSchema.parse({ email, password });

      const loginData = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (loginData?.error) {
        console.error("Login error:", loginData.error);
        setAlertMessage("Identifiants incorrects");
        setOpen(true);
        return;
      }

      const updatedSession = await getSession();

      const statutUser = updatedSession?.user?.statutUser;

      if (statutUser !== "ACTIF") {
        setAlertMessage(
          "Votre compte est suspendu ou inactif. Veuillez contacter l'administrateur."
        );
        setOpen(true);
        return;
      } else {
        const role = updatedSession?.user?.role;

        if (role === "PERSO") {
          router.push("/personnel/");
        } else if (role === "PRO") {
          router.push("/professionnel/");
        } else if (role === "ADMIN") {
          router.push(`/admin/`);
        } else {
          router.push("/login");
        }

        router.refresh();
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation failed:", error.errors);
      } else {
        console.error("Login error:", error);
        setAlertMessage(
          "Une erreur s'est produite lors de la connexion. Veuillez réessayer."
        );
        setOpen(true);
      }
    }
  };

  const handlePrev = () => {
    router.push("/");
  };

  return (
    <div className="flex min-h-screen ">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center ">
            <Image
              src="/assets/logo.svg"
              width={150}
              height={100}
              alt="Logo Lilee"
              className="mx-auto h-24 w-auto"
            />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              Bon retour parmi nous
            </h2>
            <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
              Accédez à votre compte pour découvrir les dernières nouveautés.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="rounded-md shadow-sm space-y-4">
              <div className="grid gap-2 ">
                <Label htmlFor="email">Votre adresse email</Label>
                <Input
                  id="email"
                  placeholder="email@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white p-2 border border-gray-300 rounded"
                />
              </div>

              <div className="grid gap-2 mt-5">
                <div className="flex items-center">
                  <Label htmlFor="password">Votre mot de passe</Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="*******"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white p-2 border border-gray-300 rounded"
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#15213d] focus:ring-[#15213d] border-gray-300 rounded"
                />
                <Label
                  htmlFor="remember-me"
                  className="ml-2 block text-base text-gray-900 dark:text-gray-300"
                >
                  Se souvenir de moi
                </Label>
              </div>

              <div className="text-base">
                <Link
                  href="/forgot-password"
                  className="font-medium text-[#15213d] focus:ring-[#15213d] dark:text-[#15213d] dark:hover:text-[#15213d] hover:underline"
                >
                  Mot de passe oublié?
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleSubmit}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-base font-medium rounded-md text-white  focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                Se connecter
              </Button>
              <Button
                onClick={handlePrev}
                variant="outline"
                className="w-full text-[#15213d] hover:border-[#15213d] focus:ring-[#15213d]"
              >
                Revenir à l&apos;accueil
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

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Accès refusé</AlertDialogTitle>
          <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
          <AlertDialogAction onClick={() => setOpen(false)}>
            Fermer
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
