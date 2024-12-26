"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const articles = [
  {
    id: 1,
    titre: "Qui sommes-nous ?",
    contenu: `<div>
  <p>👋 Mon Histoire : Je m&apos;appelle Karima Kerkoub, maman solo de 5 enfants, dont 2 en situation de handicap et moi-même. ♿️</p>
  <br />
  <br />
  <p>Il y a 2 ans, j&apos;ai voulu accueillir en vacances chez moi ma famille, dont un membre est en fauteuil roulant. 🏠 Mon logement étant inadapté, car à l&apos;étage et sans ascenseur, j&apos;ai alors cherché un logement adapté sur les plateformes bien connues, mais en vain.</p>
  <br />
    <br />
  <p>Trop chers et souvent non adaptés, les photos des annonces étaient trompeuses : ni les salles de bains, ni les toilettes, ni même les entrées n&apos;étaient aux normes PMR (Personnes à Mobilité Réduite).</p>
  <br />
    <br />
  <p>Pour répondre à ce besoin, qui semble simple mais souffre du manque d&apos;intérêt des loueurs, j&apos;ai décidé de créer la plateforme <strong>Lilee</strong>. 🌟 Lilee, c&apos;est l&apos;amie qui nous aide et nous donne les bons conseils pour trouver un logement adapté, saisonnier ou à l&apos;année, vérifié et validé par des professionnels de l&apos;aménagement du handicap, sur place ou en ligne.</p>
  <br />
    <br />
  <p><strong>Lilee</strong>, c&apos;est aussi l&apos;acronyme <em>Live Like Everyone Else</em> 👉 (Vivre Comme Tout Le Monde). 💻 Grâce à cette plateforme, les personnes à mobilité réduite pourront trouver des logements labellisés PMR et même ceux qui ne le sont pas, mais qui restent toujours adaptés.</p>
</div>

  `,
    createdAt: "2024-12-01T10:00:00.000Z",
    updatedAt: "2024-12-01T10:00:00.000Z",
    images: [{ path: "/blog/image1.png" }],
    categorieArticle: "Actualité",
  },

  {
    id: 2,
    titre: "Le saviez-vous ?",
    contenu: `<div>
  <p style="margin-bottom: 20px;">Un logement aux normes PMR (Personnes à Mobilité Réduite) est conçu pour être accessible et confortable pour les personnes ayant des difficultés de mobilité, qu&apos;elles soient permanentes ou temporaires. Voici quelques caractéristiques clés de ces logements :</p>

  <p style="margin-bottom: 20px;"><strong>Accès sans obstacle :</strong> Les entrées sont équipées de rampes ou de surfaces planes pour faciliter l&apos;accès en fauteuil roulant ou pour ceux qui ont des difficultés à utiliser des marches.</p>

  <p style="margin-bottom: 20px;"><strong>Portes plus larges :</strong> Les portes sont suffisamment larges pour permettre le passage aisé d&apos;un fauteuil roulant.</p>

  <p style="margin-bottom: 20px;"><strong>Interrupteurs et prises accessibles :</strong> Les interrupteurs, les prises électriques et autres commandes sont placés à une hauteur accessible depuis un fauteuil roulant.</p>

  <p style="margin-bottom: 20px;"><strong>Salle de bain adaptée :</strong> Équipée de barres d&apos;appui, de sièges de douche et d&apos;un espace suffisant pour manœuvrer un fauteuil roulant.</p>

  <p style="margin-bottom: 20px;"><strong>Cuisine adaptée :</strong> Les plans de travail et les éviers sont à une hauteur appropriée, et l&apos;espace est conçu pour permettre la circulation en fauteuil roulant.</p>

  <p style="margin-bottom: 20px;"><strong>Circulation intérieure :</strong> Les espaces de vie sont suffisamment spacieux pour permettre une circulation fluide et sans obstacle.</p>

  <p style="margin-bottom: 20px;">L&apos;objectif est de créer un environnement sécurisé et indépendant pour les personnes à mobilité réduite, en réduisant au maximum les contraintes physiques et en favorisant l&apos;autonomie. Ces normes sont particulièrement importantes dans les constructions neuves et les rénovations majeures pour assurer l&apos;accessibilité à tous.</p>
</div>
`,
    createdAt: "2024-12-05T12:00:00.000Z",
    updatedAt: "2024-12-06T15:00:00.000Z",
    images: [{ path: "/blog/image3.jpg" }],
    categorieArticle: "Actualité",
  },

  {
    id: 3,
    titre: "Norme PMR : Qui est concerné ?",
    contenu: `<div>
  <p style="margin-bottom: 20px;">La norme PMR (Personnes à Mobilité Réduite) concerne toutes les personnes ayant des difficultés à se déplacer, que ce soit de manière permanente ou temporaire. Cela inclut les personnes en fauteuil roulant, les personnes âgées, les femmes enceintes ou les personnes ayant des problèmes de santé temporaires.</p>

  <p style="margin-bottom: 20px;">La norme PMR vise à rendre les bâtiments publics, les transports en commun, les espaces publics et les logements accessibles à tous. Les bâtiments publics doivent respecter des normes strictes en matière d&apos;accessibilité, notamment en installant des rampes d&apos;accès, des ascenseurs et des toilettes adaptées aux personnes à mobilité réduite.</p>

  <p style="margin-bottom: 20px;">Les transports en commun doivent également être accessibles aux personnes à mobilité réduite. Cela peut inclure des bus équipés de rampes d&apos;accès, des métros avec des ascenseurs et des gares équipées de systèmes de guidage et de signalisation pour les personnes aveugles ou malvoyantes.</p>

  <p style="margin-bottom: 20px;">Les espaces publics tels que les trottoirs, les parcs et les jardins doivent également être accessibles à tous. Cela peut inclure des revêtements de sol adaptés, des bancs adaptés aux personnes en fauteuil roulant et des sentiers accessibles.</p>

  <p style="margin-bottom: 20px;">Enfin, les logements doivent également être adaptés aux personnes à mobilité réduite. Cela peut inclure des portes plus larges pour permettre le passage d&apos;un fauteuil roulant, des interrupteurs et des prises à hauteur accessible et des salles de bains adaptées.</p>

  <p style="margin-bottom: 20px;">En résumé, la norme PMR concerne toutes les personnes ayant des difficultés à se déplacer. Elle vise à rendre les bâtiments publics, les transports en commun, les espaces publics et les logements accessibles à tous. Les normes d&apos;accessibilité varient en fonction du type de bâtiment ou d&apos;espace public, mais l&apos;objectif est toujours le même : permettre à tous de se déplacer en toute autonomie et en toute sécurité.</p>

  <p style="margin-bottom: 20px;">Si vous êtes à la recherche d&apos;une location adaptée aux personnes à mobilité réduite, nous vous invitons à découvrir <a href="https://lilee.fr" target="_blank">Lilee.fr</a>. Cette plateforme en ligne vous permet de trouver facilement des logements PMR pour répondre à vos besoins spécifiques, que ce soit pour un court ou un long séjour.</p>
</div>

`,
    createdAt: "2024-11-25T09:30:00.000Z",
    updatedAt: "2024-11-30T18:45:00.000Z",
    images: [{ path: "/blog/image2.jpg" }],
    categorieArticle: "Actualité",
  },
];
const InfoBlog = ({ params }) => {
  const { id } = params;
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchedArticle = articles.find((a) => a.id.toString() === id);
    if (fetchedArticle) {
      setArticle(fetchedArticle);
    } else {
      setError("Article non trouvé.");
    }
  }, [id]);

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4 sm:px-8 lg:px-16">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <p className="text-red-500 text-center">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto py-10 px-4 sm:px-8 lg:px-16">
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-12 w-3/4 mx-auto" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const images = article.images || [];

  return (
    <div className="container mx-auto py-10 px-4 sm:px-8 lg:px-16">
      <Card className="overflow-hidden">
        <CardContent className="p-6 sm:p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex justify-center items-center">
              {images[0]?.path && (
                <Image
                  src={images[0].path}
                  alt="Image principale"
                  width={800}
                  height={600}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "500px",
                    objectFit: "cover",
                    cursor: "pointer",
                    borderRadius: "10px",
                  }}
                />
              )}
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl text-primary font-bold text-center">
                {article.titre}
              </h1>
              <div className="flex justify-center items-center space-x-4">
                <Badge variant="secondary" className="text-sm">
                  {article.categorieArticle}
                </Badge>
                <p className="text-muted-foreground text-sm">
                  {new Date(article.createdAt).toLocaleString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{
                  __html: article.contenu.replace(/^"|"$/g, ""),
                }}
              />
            </div>
          </div>

          <div className="pt-10 flex justify-center">
            <Link href="/Blog" passHref>
              <Button size="lg">
                Voir d&apos;autres articles
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfoBlog;
