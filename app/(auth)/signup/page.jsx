"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const SignUpPage = () => {
  const router = useRouter();

  const handlePersonnel = () => {
    router.push("/signup/personnel");
  };

  const handleProfessionnel = () => {
    router.push("/signup/professionnel");
  };

  const handleAdmin = () => {
    router.push("/signup/admin");
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
              Choisissez le type de compte que vous souhaitez créer
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <Button onClick={handlePersonnel} className="w-full text-base">
              Personnel
            </Button>
            <Button onClick={handleProfessionnel} className="w-full text-base">
              Professionel
            </Button>
            {/* <Button onClick={handleAdmin} className="w-full text-base">
              Administrateur
            </Button> */}
          </div>

          <div className="mt-6 text-center text-base">
            <span className="text-gray-600 dark:text-gray-400">
              Vous avez déjà un compte? {""}
            </span>
            <Link
              href="/login"
              className="font-medium text-[#15213d] focus:ring-[#15213d] dark:text-[#15213d] dark:hover:text-[#15213d] hover:underline"
            >
              Se connecter
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
};

export default SignUpPage;
