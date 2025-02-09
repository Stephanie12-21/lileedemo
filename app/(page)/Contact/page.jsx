"use client";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SuccessModal } from "@/app/(dialog)/success/SuccessModal";
import { ErrorModal } from "@/app/(dialog)/error/ErrorModal";

const Contact = () => {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [objet, setObjet] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      nom,
      prenom,
      email,
      phone: `+${phone}`,
      objet,
      message,
    };

    try {
      const response = await fetch("/api/contact/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(
          "Une erreur s'est produite lors de l'envoi du message."
        );
      }

      setIsSuccessModalOpen(true);
      handleResetForm();
    } catch (error) {
      setIsErrorModalOpen(true);
      setError("Une erreur s'est produite lors de l'envoi du message.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setNom("");
    setPrenom("");
    setEmail("");
    setPhone("");
    setObjet("");
    setMessage("");
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center items-center pt-10 pb-10 space-y-5 lg:space-y-0 lg:space-x-10 px-5 mx-4 md:mx-8 lg:mx-16">
      <Card className="w-full max-w-md lg:max-w-lg xl:max-w-2xl h-auto p-5 shadow-lg rounded-lg flex-shrink-0">
        <CardHeader className="flex items-center justify-center">
          <CardTitle className="text-center text-3xl">
            Prenons contact
          </CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="pt-3">
            <div className="grid w-full items-center gap-4">
              <div className="grid w-full items-center gap-2">
                <div className="flex flex-col lg:flex-row w-full space-x-0 lg:space-x-2">
                  <div className="w-full space-y-2">
                    <Label
                      htmlFor="nom"
                      className="text-right text-[#425466] font-medium text-[16px]"
                    >
                      Nom
                    </Label>
                    <Input
                      id="nom"
                      placeholder="Nom"
                      value={nom}
                      required
                      onChange={(e) => setNom(e.target.value)}
                      className="col-span-3 items-start w-full bg-[#edf2f7] text-[15px] text-[#27272E] font-medium"
                    />
                  </div>

                  <div className="w-full space-y-2 mt-2 lg:mt-0">
                    <Label
                      htmlFor="prenom"
                      className="text-right text-[#425466] font-medium text-[16px]"
                    >
                      Prénom
                    </Label>
                    <Input
                      id="prenom"
                      placeholder="Prénom"
                      value={prenom}
                      required
                      onChange={(e) => setPrenom(e.target.value)}
                      className="col-span-3 items-start w-full bg-[#edf2f7] text-[15px] text-[#27272E] font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-right text-[#425466] font-medium text-[16px]"
                  >
                    Votre adresse email
                  </Label>
                  <Input
                    id="email"
                    placeholder="email@gmail.com"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    className="col-span-3 items-start w-full bg-[#edf2f7] text-[15px] text-[#27272E] font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="num"
                    className="text-right text-[#425466] font-medium text-[16px]"
                  >
                    Votre numéro de téléphone
                  </Label>
                  <PhoneInput
                    country={"fr"}
                    value={phone}
                    required
                    onChange={setPhone}
                    placeholder="Entrez votre numéro"
                    inputStyle={{ width: "100%", height: "40px" }}
                    buttonClass="custom-flag-style"
                    inputClass="col-span-3 items-start w-full bg-[#edf2f7] text-[15px] text-[#27272E] font-medium"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label
                    htmlFor="objet"
                    className="text-[#425466] font-medium text-[16px]"
                  >
                    L&apos;objet du message
                  </Label>
                  <Input
                    id="objet"
                    placeholder="L'objet du message"
                    value={objet}
                    required
                    onChange={(e) => setObjet(e.target.value)}
                    className="col-span-3 items-start w-full bg-[#edf2f7] text-[15px] text-[#27272E] font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="message"
                    className="text-right text-[#425466] font-medium text-[16px]"
                  >
                    Votre message
                  </Label>
                  <textarea
                    id="message"
                    value={message}
                    required
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Écrivez votre message ici"
                    className="col-span-3 w-full h-64 bg-[#edf2f7] text-[15px] text-[#27272E] font-medium p-2 rounded-md"
                  />
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 pb-4 pt-8 items-center w-full">
            <Button
              className="bg-[#0f172a] text-white py-2 rounded-lg w-full"
              type="submit"
              disabled={loading}
            >
              {loading ? "Envoi en cours..." : "Envoyer le message"}
            </Button>
            <Button className="border border-[#0f172a] bg-inherit text-[#0f172a] hover:bg-inherit hover:text-[#0f172a] py-2 rounded-lg w-full mb-4 mx-4">
              Annuler
            </Button>
          </CardFooter>
        </form>
      </Card>
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
      <ErrorModal



        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
      />
    </div>
  );
};

export default Contact;
