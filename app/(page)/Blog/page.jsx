"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const Blog = () => {
  const articles = [
    {
      id: 1,
      titre: "Qui sommes-nous ?",
      contenu: `
    👋 Mon Histoire : Je m&apos;appelle Karima Kerkoub, maman solo de 5 enfants, dont 2 en situation de handicap et moi-même. ♿️

    Il y a 2 ans, j&apos;ai voulu accueillir en vacances chez moi ma famille, dont un membre est en fauteuil roulant. 🏠 Mon logement étant inadapté, car à l&apos;étage et sans ascenseur, j&apos;ai alors cherché un logement adapté sur les plateformes bien connues, mais en vain.

    Trop chers et souvent non adaptés, les photos des annonces étaient trompeuses : ni les salles de bains, ni les toilettes, ni même les entrées n&apos;étaient aux normes PMR (Personnes à Mobilité Réduite).

    Pour répondre à ce besoin, qui semble simple mais souffre du manque d&apos;intérêt des loueurs, j&apos;ai décidé de créer la plateforme **Lilee**. 🫶

    Lilee, c&apos;est l&apos;amie qui nous aide et nous donne les bons conseils pour trouver un logement adapté, saisonnier ou à l&apos;année, vérifié et validé par des professionnels de l&apos;aménagement du handicap, sur place ou en ligne.

    **Lilee**, c&apos;est aussi l&apos;acronyme _Live Like Everyone Else_ 👉 (Vivre Comme Tout Le Monde). 💻 Grâce à cette plateforme, les personnes à mobilité réduite pourront trouver des logements labellisés PMR et même ceux qui ne le sont pas, mais qui restent toujours adaptés.
  `,
      createdAt: "2024-12-01T10:00:00.000Z",
      updatedAt: "2024-12-01T10:00:00.000Z",
      images: [{ path: "/blog/image1.png" }],
      categorieArticle: "Actualité",
    },

    {
      id: 2,
      titre: "Le saviez-vous ?",
      contenu: `Un logement aux normes PMR (Personnes à Mobilité Réduite) est conçu pour être accessible et confortable pour les personnes ayant des difficultés de mobilité, qu&apos;elles soient permanentes ou temporaires. Voici quelques caractéristiques clés de ces logements :

Accès sans obstacle :Les entrées sont équipées de rampes ou de surfaces planes pour faciliter l&apos;accès en fauteuil roulant ou pour ceux qui ont des difficultés à utiliser des marches.

Portes plus larges : Les portes sont suffisamment larges pour permettre le passage aisé d&apos;un fauteuil roulant.

Interrupteurs et prises accessibles :
Les interrupteurs, les prises électriques et autres commandes sont placés à une hauteur accessible depuis un fauteuil roulant.

Salle de bain adaptée :Équipée de barres d&apos;appui, de sièges de douche et d&apos;un espace suffisant pour manœuvrer un fauteuil roulant.

Cuisine adaptée :Les plans de travail et les éviers sont à une hauteur appropriée, et l&apos;espace est conçu pour permettre la circulation en fauteuil roulant.

Circulation intérieure : Les espaces de vie sont suffisamment spacieux pour permettre une circulation fluide et sans obstacle.

L&apos;objectif est de créer un environnement sécurisé et indépendant pour les personnes à mobilité réduite, en réduisant au maximum les contraintes physiques et en favorisant l&apos;autonomie. Ces normes sont particulièrement importantes dans les constructions neuves et les rénovations majeures pour assurer l&apos;accessibilité à tous.`,
      createdAt: "2024-12-05T12:00:00.000Z",
      updatedAt: "2024-12-06T15:00:00.000Z",
      images: [{ path: "/blog/image3.jpg" }],
      categorieArticle: "Actualité",
    },
    {
      id: 3,
      titre: "Norme PMR : Qui est concerné ?",
      contenu: `La norme PMR (Personnes à Mobilité Réduite) concerne toutes les personnes ayant des difficultés à se déplacer, que ce soit de manière permanente ou temporaire. Cela inclut les personnes en fauteuil roulant, les personnes âgées, les femmes enceintes ou les personnes ayant des problèmes de santé temporaires.

La norme PMR vise à rendre les bâtiments publics, les transports en commun, les espaces publics et les logements accessibles à tous. Les bâtiments publics doivent respecter des normes strictes en matière d&apos;accessibilité, notamment en installant des rampes d&apos;accès, des ascenseurs et des toilettes adaptées aux personnes à mobilité réduite.

Les transports en commun doivent également être accessibles aux personnes à mobilité réduite. Cela peut inclure des bus équipés de rampes d&apos;accès, des métros avec des ascenseurs et des gares équipées de systèmes de guidage et de signalisation pour les personnes aveugles ou malvoyantes.

Les espaces publics tels que les trottoirs, les parcs et les jardins doivent également être accessibles à tous. Cela peut inclure des revêtements de sol adaptés, des bancs adaptés aux personnes en fauteuil roulant et des sentiers accessibles.

Enfin, les logements doivent également être adaptés aux personnes à mobilité réduite. Cela peut inclure des portes plus larges pour permettre le passage d&apos;un fauteuil roulant, des interrupteurs et des prises à hauteur accessible et des salles de bains adaptées.

En résumé, la norme PMR concerne toutes les personnes ayant des difficultés à se déplacer. Elle vise à rendre les bâtiments publics, les transports en commun, les espaces publics et les logements accessibles à tous. Les normes d&apos;accessibilité varient en fonction du type de bâtiment ou d&apos;espace public, mais l&apos;objectif est toujours le même : permettre à tous de se déplacer en toute autonomie et en toute sécurité.

Si vous êtes à la recherche d&apos;une location adaptée aux personnes à mobilité réduite, nous vous invitons à découvrir Lilee.fr. Cette plateforme en ligne vous permet de trouver facilement des logements PMR pour répondre à vos besoins spécifiques, que ce soit pour un court ou un long séjour.`,
      createdAt: "2024-11-25T09:30:00.000Z",
      updatedAt: "2024-11-30T18:45:00.000Z",
      images: [{ path: "/blog/image2.jpg" }],
      categorieArticle: "Actualité",
    },
  ];

  const cardVariants = {
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
    hidden: {
      opacity: 0,
      y: 50,
      transition: { duration: 0.5 },
    },
  };

  const removeQuotes = (content) => content.replace(/^"|"$/g, "");

  return (
    <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl md:text-5xl text-primary font-bold text-center mb-12">
        Blog & Presse
      </h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, index) => (
          <motion.div
            key={article.id}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="relative h-48 md:h-64">
                  {article.images && article.images.length > 0 ? (
                    <Image
                      src={article.images[0].path}
                      alt={article.titre}
                      layout="fill"
                      objectFit="cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <p className="text-gray-500">Aucune image disponible</p>
                    </div>
                  )}
                  <Badge className="absolute top-4 py-1 text-base right-4 bg-[#15213d] text-primary-foreground hover:bg-[#15213d] hover:text-white">
                    {article.categorieArticle}
                  </Badge>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-primary mb-2 line-clamp-2">
                    {article.titre}
                  </h2>
                  <p className="text-base text-muted-foreground mb-4">
                    {article.createdAt === article.updatedAt
                      ? `Publié le ${new Date(article.createdAt).toLocaleString(
                          "fr-FR",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}`
                      : `Modifié le ${new Date(
                          article.updatedAt
                        ).toLocaleString("fr-FR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}`}
                  </p>
                  <div
                    className="text-base text-muted-foreground mb-4 line-clamp-3"
                    dangerouslySetInnerHTML={{
                      __html:
                        removeQuotes(article.contenu.substring(0, 150)) + "...",
                    }}
                  />
                  <Link href={`/Blog/InfoBlog/${article.id}`} passHref>
                    <Button
                      variant="outline"
                      className="w-full hover:bg-primary hover:text-white"
                    >
                      Lire l&apos;article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Link href="/Blog" passHref>
          <Button size="lg">
            Charger d&apos;autres articles
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Blog;
