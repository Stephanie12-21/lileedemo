"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import "react-phone-input-2/lib/style.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

const PAYS = [
  { label: "Afghanistan", value: "afghanistan" },
  { label: "Afrique du Sud", value: "afrique-du-sud" },
  { label: "Albanie", value: "albanie" },
  { label: "Algérie", value: "algerie" },
  { label: "Allemagne", value: "allemagne" },
  { label: "Andorre", value: "andorre" },
  { label: "Angola", value: "angola" },
  { label: "Antigua-et-Barbuda", value: "antigua-et-barbuda" },
  { label: "Arabie saoudite", value: "arabie-saoudite" },
  { label: "Argentine", value: "argentine" },
  { label: "Arménie", value: "armenie" },
  { label: "Australie", value: "australie" },
  { label: "Autriche", value: "autriche" },
  { label: "Azerbaïdjan", value: "azerbaidjan" },
  { label: "Bahamas", value: "bahamas" },
  { label: "Bahreïn", value: "bahrein" },
  { label: "Bangladesh", value: "bangladesh" },
  { label: "Barbade", value: "barbade" },
  { label: "Belgique", value: "belgique" },
  { label: "Belize", value: "belize" },
  { label: "Bénin", value: "benin" },
  { label: "Bhoutan", value: "bhoutan" },
  { label: "Biélorussie", value: "bielorussie" },
  { label: "Birmanie", value: "birmanie" },
  { label: "Bolivie", value: "bolivie" },
  { label: "Bosnie-Herzégovine", value: "bosnie-herzegovine" },
  { label: "Botswana", value: "botswana" },
  { label: "Brésil", value: "bresil" },
  { label: "Brunei", value: "brunei" },
  { label: "Bulgarie", value: "bulgarie" },
  { label: "Burkina Faso", value: "burkina-faso" },
  { label: "Burundi", value: "burundi" },
  { label: "Cabo Verde", value: "cabo-verde" },
  { label: "Cambodge", value: "cambodge" },
  { label: "Cameroun", value: "cameroun" },
  { label: "Canada", value: "canada" },
  { label: "Chili", value: "chili" },
  { label: "Chine", value: "chine" },
  { label: "Chypre", value: "chypre" },
  { label: "Colombie", value: "colombie" },
  { label: "Comores", value: "comores" },
  { label: "Congo (Brazzaville)", value: "congo-brazzaville" },
  { label: "Congo (Kinshasa)", value: "congo-kinshasa" },
  { label: "Corée du Nord", value: "coree-du-nord" },
  { label: "Corée du Sud", value: "coree-du-sud" },
  { label: "Costa Rica", value: "costa-rica" },
  { label: "Côte d’Ivoire", value: "cote-divoire" },
  { label: "Croatie", value: "croatie" },
  { label: "Cuba", value: "cuba" },
  { label: "Danemark", value: "danemark" },
  { label: "Djibouti", value: "djibouti" },
  { label: "Dominique", value: "dominique" },
  { label: "Égypte", value: "egypte" },
  { label: "Émirats arabes unis", value: "emirats-arabes-unis" },
  { label: "Équateur", value: "equateur" },
  { label: "Érythrée", value: "erythree" },
  { label: "Espagne", value: "espagne" },
  { label: "Estonie", value: "estonie" },
  { label: "Eswatini", value: "eswatini" },
  { label: "États-Unis", value: "etats-unis" },
  { label: "Éthiopie", value: "ethiopie" },
  { label: "Fidji", value: "fidji" },
  { label: "Finlande", value: "finlande" },
  { label: "France", value: "france" },
  { label: "Gabon", value: "gabon" },
  { label: "Gambie", value: "gambie" },
  { label: "Géorgie", value: "georgie" },
  { label: "Ghana", value: "ghana" },
  { label: "Grèce", value: "grece" },
  { label: "Grenade", value: "grenade" },
  { label: "Guatemala", value: "guatemala" },
  { label: "Guinée", value: "guinee" },
  { label: "Guinée-Bissau", value: "guinee-bissau" },
  { label: "Guyana", value: "guyana" },
  { label: "Haïti", value: "haiti" },
  { label: "Honduras", value: "honduras" },
  { label: "Hongrie", value: "hongrie" },
  { label: "Inde", value: "inde" },
  { label: "Indonésie", value: "indonesie" },
  { label: "Irak", value: "irak" },
  { label: "Iran", value: "iran" },
  { label: "Irlande", value: "irlande" },
  { label: "Islande", value: "islande" },
  { label: "Israël", value: "israel" },
  { label: "Italie", value: "italie" },
  { label: "Jamaïque", value: "jamaique" },
  { label: "Japon", value: "japon" },
  { label: "Jordanie", value: "jordanie" },
  { label: "Kazakhstan", value: "kazakhstan" },
  { label: "Kenya", value: "kenya" },
  { label: "Kirghizistan", value: "kirghizistan" },
  { label: "Kiribati", value: "kiribati" },
  { label: "Koweït", value: "koweit" },
  { label: "Laos", value: "laos" },
  { label: "Lesotho", value: "lesotho" },
  { label: "Lettonie", value: "lettonie" },
  { label: "Liban", value: "liban" },
  { label: "Libéria", value: "liberia" },
  { label: "Libye", value: "libye" },
  { label: "Liechtenstein", value: "liechtenstein" },
  { label: "Lituanie", value: "lituanie" },
  { label: "Luxembourg", value: "luxembourg" },
  { label: "Madagascar", value: "madagascar" },
  { label: "Malaisie", value: "malaisie" },
  { label: "Malawi", value: "malawi" },
  { label: "Maldives", value: "maldives" },
  { label: "Mali", value: "mali" },
  { label: "Malte", value: "malte" },
  { label: "Maroc", value: "maroc" },
  { label: "Maurice", value: "maurice" },
  { label: "Mauritanie", value: "mauritanie" },
  { label: "Mexique", value: "mexique" },
  { label: "Micronésie", value: "micronesie" },
  { label: "Moldavie", value: "moldavie" },
  { label: "Monaco", value: "monaco" },
  { label: "Mongolie", value: "mongolie" },
  { label: "Monténégro", value: "montenegro" },
  { label: "Mozambique", value: "mozambique" },
  { label: "Namibie", value: "namibie" },
  { label: "Nauru", value: "nauru" },
  { label: "Népal", value: "nepal" },
  { label: "Nicaragua", value: "nicaragua" },
  { label: "Niger", value: "niger" },
  { label: "Nigéria", value: "nigeria" },
  { label: "Norvège", value: "norvege" },
  { label: "Nouvelle-Zélande", value: "nouvelle-zelande" },
  { label: "Oman", value: "oman" },
  { label: "Ouganda", value: "ouganda" },
  { label: "Ouzbékistan", value: "ouzbekistan" },
  { label: "Pakistan", value: "pakistan" },
  { label: "Palaos", value: "palaos" },
  { label: "Panama", value: "panama" },
  { label: "Papouasie-Nouvelle-Guinée", value: "papouasie-nouvelle-guinee" },
  { label: "Paraguay", value: "paraguay" },
  { label: "Pays-Bas", value: "pays-bas" },
  { label: "Pérou", value: "perou" },
  { label: "Philippines", value: "philippines" },
  { label: "Pologne", value: "pologne" },
  { label: "Portugal", value: "portugal" },
  { label: "Qatar", value: "qatar" },
  { label: "Roumanie", value: "roumanie" },
  { label: "Royaume-Uni", value: "royaume-uni" },
  { label: "Russie", value: "russie" },
  { label: "Rwanda", value: "rwanda" },
  { label: "Saint-Christophe-et-Niévès", value: "saint-christophe-et-nieves" },
  { label: "Saint-Marin", value: "saint-marin" },
  {
    label: "Saint-Vincent-et-les-Grenadines",
    value: "saint-vincent-et-les-grenadines",
  },
  { label: "Sainte-Lucie", value: "sainte-lucie" },
  { label: "Salomon", value: "salomon" },
  { label: "Salvador", value: "salvador" },
  { label: "Samoa", value: "samoa" },
  { label: "Sao Tomé-et-Principe", value: "sao-tome-et-principe" },
  { label: "Sénégal", value: "senegal" },
  { label: "Serbie", value: "serbie" },
  { label: "Seychelles", value: "seychelles" },
  { label: "Sierra Leone", value: "sierra-leone" },
  { label: "Singapour", value: "singapour" },
  { label: "Slovaquie", value: "slovaquie" },
  { label: "Slovénie", value: "slovenie" },
  { label: "Somalie", value: "somalie" },
  { label: "Soudan", value: "soudan" },
  { label: "Soudan du Sud", value: "soudan-du-sud" },
  { label: "Sri Lanka", value: "sri-lanka" },
  { label: "Suède", value: "suede" },
  { label: "Suisse", value: "suisse" },
  { label: "Suriname", value: "suriname" },
  { label: "Syrie", value: "syrie" },
  { label: "Tadjikistan", value: "tadjikistan" },
  { label: "Tanzanie", value: "tanzanie" },
  { label: "Tchad", value: "tchad" },
  { label: "Thaïlande", value: "thailande" },
  { label: "Timor oriental", value: "timor-oriental" },
  { label: "Togo", value: "togo" },
  { label: "Tonga", value: "tonga" },
  { label: "Trinité-et-Tobago", value: "trinite-et-tobago" },
  { label: "Tunisie", value: "tunisie" },
  { label: "Turkménistan", value: "turkmenistan" },
  { label: "Turquie", value: "turquie" },
  { label: "Tuvalu", value: "tuvalu" },
  { label: "Ukraine", value: "ukraine" },
  { label: "Uruguay", value: "uruguay" },
  { label: "Vanuatu", value: "vanuatu" },
  { label: "Vatican", value: "vatican" },
  { label: "Venezuela", value: "venezuela" },
  { label: "Vietnam", value: "vietnam" },
  { label: "Yémen", value: "yemen" },
  { label: "Zambie", value: "zambie" },
  { label: "Zimbabwe", value: "zimbabwe" },
];

export default function FormulaireContact() {
  const router = useRouter();
  const { data: session } = useSession();
  const [adresse, setAdresse] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [ville, setVille] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [nomComplet, setNomComplet] = useState(() => {
    const nom = session?.user?.nom || "";
    const prenom = session?.user?.prenom || "";
    return `${prenom} ${nom}`.trim();
  });
  const userid = session?.user.id;

  const handleSelectChange = (value) => {
    setSelectedCountry(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation client avant l'envoi
    if (
      !nomComplet ||
      !adresse ||
      !codePostal ||
      !ville ||
      !selectedCountry ||
      !userid
    ) {
      toast.error("Tous les champs sont requis.");
      return;
    }

    console.log({
      userid,
      nomComplet,
      adresse,
      codePostal,
      ville,
      selectedCountry,
    });

    const formData = new FormData();
    formData.append("nomComplet", nomComplet);
    formData.append("adresse", adresse);
    formData.append("codePostal", codePostal);
    formData.append("ville", ville);
    formData.append("selectedCountry", selectedCountry);
    formData.append("userid", userid);

    try {
      const response = await fetch("/api/facturation", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Erreur HTTP : ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Adresse de facturation ajoutée avec succès :", data);

      toast.success("Adresse de facturation ajoutée avec succès");

      // Réinitialisation des champs
      setNomComplet("");
      setAdresse("");
      setCodePostal("");
      setVille("");
      setSelectedCountry("");

      // Redirection après un délai
      setTimeout(() => {
        router.push("/personnel/facturation");
      }, 3000);
    } catch (error) {
      // Affichage des erreurs spécifiques
      toast.error(
        error.message || "Erreur lors de l'ajout de l'adresse de facturation"
      );
      console.error(
        "Erreur lors de l'ajout de l'adresse de facturation :",
        error
      );
    }
  };

  return (
    <div className="container mx-auto py-10 px-20">
      <div className="flex flex-col lg:flex-row justify-center items-center   pt-10 pb-10 space-y-5 lg:space-y-0 lg:space-x-10 px-5">
        <Card className="w-full max-w-md lg:max-w-lg xl:max-w-2xl h-auto p-5 shadow-md rounded-lg flex-shrink-0">
          <CardHeader className="flex items-center justify-center">
            <CardTitle className="text-center text-3xl mb-2">
              Adresse de facturation
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-5">
            <div className="grid w-full items-center gap-4">
              <div className="grid w-full items-center gap-2">
                <div className="w-full space-y-2">
                  <Label htmlFor="nomComplet">Nom complet</Label>
                  <Input
                    id="nomComplet"
                    name="nomComplet"
                    value={nomComplet || ""}
                    onChange={(e) => setNomComplet(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pays">Pays</Label>
                  <Select
                    onValueChange={handleSelectChange}
                    value={selectedCountry}
                    placeholder="Sélectionnez un pays"
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un pays" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {PAYS.map((pays) => (
                        <SelectItem key={pays.value} value={pays.value}>
                          {pays.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adresse">Adresse exacte</Label>
                  <Input
                    id="adresse"
                    name="adresse"
                    value={adresse}
                    onChange={(e) => setAdresse(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="codePostal">Code postal</Label>
                  <Input
                    id="codePostal"
                    name="codePostal"
                    value={codePostal}
                    onChange={(e) => setCodePostal(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ville">Ville</Label>
                  <Input
                    id="ville"
                    name="ville"
                    value={ville}
                    onChange={(e) => setVille(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3 pb-4 pt-8 items-center w-full">
            <Button
              className="bg-[#0f172a] text-white py-2 rounded-lg w-full"
              onClick={handleSubmit}
            >
              Enregistrer les informations
            </Button>
            <Button className="bg-[#0f172a] text-white py-2 rounded-lg w-full mb-4 mx-4">
              Annuler
            </Button>
          </CardFooter>
        </Card>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
