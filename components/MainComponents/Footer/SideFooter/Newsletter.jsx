"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewsLetter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Veuillez entrer un email valide");
      return;
    }

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Vous êtes bien abonné à la newsletter !");
        setEmail("");
      } else if (response.status === 409) {
        toast.error("Vous êtes déjà abonné avec cet email.");
        setEmail("");
      } else {
        toast.error("Erreur lors de l'abonnement. Essayez à nouveau.");
        setEmail("");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      toast.error("Erreur lors de la connexion au serveur.");
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="flex flex-col space-y-3">
        <Label className="text-[22px] font-bold text-white">
          Abonnez-vous à notre{" "}
          <span className="text-[#FCA311]">newsletter</span> pour ne rien
          manquer.
        </Label>
        <div className="flex gap-x-4">
          <Input
            id="userEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre adresse email"
            className="font-medium text-[16px] bg-transparent text-[#FAFAFA]"
          />
          <Button
            onClick={handleSubmit}
            className="rounded-[8px] text-[#15213D] font-bold px-9 text-[16px] bg-white hover:bg-[#FCA311] hover:text-[#FAFAFA]"
          >
            S&apos;abonner
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewsLetter;
