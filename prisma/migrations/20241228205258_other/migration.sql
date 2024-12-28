-- CreateEnum
CREATE TYPE "statut" AS ENUM ('PUBLIEE', 'DESACTIVEE', 'EN_ATTENTE_DE_VALIDATION');

-- CreateEnum
CREATE TYPE "typeTarif" AS ENUM ('JOURNALIER', 'NUITEE', 'FIXE', 'MENSUEL');

-- CreateEnum
CREATE TYPE "priority" AS ENUM ('URGENT', 'POPULAIRE', 'RECOMMANDATION');

-- CreateEnum
CREATE TYPE "categorieAnnonce" AS ENUM ('IMMOBILIER', 'VETEMENT', 'EMPLOI_SERVICE', 'VOITURE', 'LOISIR', 'MATERIEL', 'MOBILIER', 'DONS');

-- CreateTable
CREATE TABLE "favoris" (
    "id" SERIAL NOT NULL,
    "saveDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "annonceId" INTEGER NOT NULL,

    CONSTRAINT "favoris_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "annonces" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prix" DECIMAL(65,30),
    "typeTarif" "typeTarif",
    "priority" "priority",
    "localisation" TEXT,
    "adresse" TEXT NOT NULL,
    "statut" "statut" DEFAULT 'EN_ATTENTE_DE_VALIDATION',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categorieAnnonce" "categorieAnnonce" NOT NULL,
    "sousCategorie" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "annonces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imageAnnonce" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "annoncesId" INTEGER NOT NULL,

    CONSTRAINT "imageAnnonce_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commentaire" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "commentaire" TEXT NOT NULL,
    "note" INTEGER,
    "annoncesId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "commentaire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temoignages" (
    "id" SERIAL NOT NULL,
    "temoignage" TEXT NOT NULL,
    "noteLilee" INTEGER NOT NULL,
    "ville" TEXT,
    "pays" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "temoignages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moyenpaiement" (
    "id" SERIAL NOT NULL,
    "cardNumber" TEXT NOT NULL,
    "nameOnCard" TEXT NOT NULL,
    "cardCVC" INTEGER NOT NULL,
    "cardExpiry" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "moyenpaiement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "annonces_titre_key" ON "annonces"("titre");

-- CreateIndex
CREATE UNIQUE INDEX "moyenpaiement_cardNumber_key" ON "moyenpaiement"("cardNumber");

-- CreateIndex
CREATE UNIQUE INDEX "moyenpaiement_cardCVC_key" ON "moyenpaiement"("cardCVC");

-- AddForeignKey
ALTER TABLE "favoris" ADD CONSTRAINT "favoris_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favoris" ADD CONSTRAINT "favoris_annonceId_fkey" FOREIGN KEY ("annonceId") REFERENCES "annonces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "annonces" ADD CONSTRAINT "annonces_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imageAnnonce" ADD CONSTRAINT "imageAnnonce_annoncesId_fkey" FOREIGN KEY ("annoncesId") REFERENCES "annonces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentaire" ADD CONSTRAINT "commentaire_annoncesId_fkey" FOREIGN KEY ("annoncesId") REFERENCES "annonces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentaire" ADD CONSTRAINT "commentaire_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "temoignages" ADD CONSTRAINT "temoignages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moyenpaiement" ADD CONSTRAINT "moyenpaiement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
