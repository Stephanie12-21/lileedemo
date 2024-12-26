"use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Veuillez entrer un email valide");
      return;
    }

    setIsLoading(true);

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
      } else {
        toast.error("Erreur lors de l'abonnement. Essayez à nouveau.");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      toast.error("Erreur lors de la connexion au serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-blue-900 to-indigo-900 rounded-lg shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl">
      <ToastContainer />
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white text-center">
          Abonnez-vous à notre{" "}
          <span className="text-[#FCA311]">newsletter</span>
        </h2>
        <p className="text-sm text-white/80 text-center">
          Ne manquez rien de nos actualités
        </p>
        <div className="space-y-2">
          <Label htmlFor="userEmail" className="sr-only">
            Votre adresse email
          </Label>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Input
              id="userEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse email"
              className="flex-grow bg-white/10 text-white placeholder-white/50 border-white/20 transition-colors duration-200 ease-in-out focus:bg-white/20"
              aria-label="Votre adresse email"
            />
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-[#FCA311] hover:bg-[#FCA311]/80 text-[#15213D] font-bold w-full sm:w-auto transition-colors duration-200 ease-in-out"
              aria-label="S'abonner à la newsletter"
            >
              {isLoading ? (
                "Envoi..."
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" /> S&apos;abonner
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsLetter;
