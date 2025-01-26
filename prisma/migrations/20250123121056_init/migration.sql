-- CreateEnum
CREATE TYPE "statutUser" AS ENUM ('ACTIF', 'SUSPENDU');

-- CreateEnum
CREATE TYPE "secteurActivite" AS ENUM ('IMMOBILIER', 'VETEMENT', 'EMPLOI', 'SERVICE', 'VOITURE', 'LOISIR', 'MATERIEL', 'MOBILIER');

-- CreateEnum
CREATE TYPE "role" AS ENUM ('PERSO', 'PRO', 'ADMIN');

-- CreateEnum
CREATE TYPE "typeSociete" AS ENUM ('ENTREPRISE_INDIVIDUELLE', 'SOCIETE_PRIVEE', 'SOCIETE_PUBLIQUE', 'COOPERATIVE', 'ASSOCIATION');

-- CreateEnum
CREATE TYPE "statut" AS ENUM ('PUBLIEE', 'DESACTIVEE', 'EN_ATTENTE_DE_VALIDATION');

-- CreateEnum
CREATE TYPE "typeTarif" AS ENUM ('JOURNALIER', 'NUITEE', 'FIXE', 'MENSUEL');

-- CreateEnum
CREATE TYPE "priority" AS ENUM ('URGENT', 'POPULAIRE', 'RECOMMANDATION');

-- CreateEnum
CREATE TYPE "categorieAnnonce" AS ENUM ('IMMOBILIER', 'VETEMENT', 'EMPLOI_SERVICE', 'VOITURE', 'LOISIR', 'MATERIEL', 'MOBILIER', 'DONS');

-- CreateEnum
CREATE TYPE "duree" AS ENUM ('MENSUEL', 'TRIMESTRIEL', 'SEMESTRIEL', 'ANNUEL');

-- CreateEnum
CREATE TYPE "statutPartenaire" AS ENUM ('ACTIF', 'SUSPENDU');

-- CreateEnum
CREATE TYPE "transactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "newsletter" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "unsubscribeToken" TEXT,

    CONSTRAINT "newsletter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "hashPassword" TEXT NOT NULL,
    "statutUser" "statutUser" NOT NULL,
    "role" "role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" INTEGER,
    "stripeAccountId" TEXT,
    "stripeAccountCompleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company" (
    "id" SERIAL NOT NULL,
    "siret" TEXT NOT NULL,
    "nomSociete" TEXT NOT NULL,
    "codePostal" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "secteurActivite" "secteurActivite" NOT NULL,
    "typeSociete" "typeSociete" NOT NULL,

    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profileImage" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "profileImage_pkey" PRIMARY KEY ("id")
);

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
    "priceId" TEXT,

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

-- CreateTable
CREATE TABLE "engagement" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "statutPartenaire" "statutPartenaire" NOT NULL DEFAULT 'ACTIF',
    "siteWeb" TEXT,
    "adresse" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "facebook" TEXT,
    "instagram" TEXT,
    "twitter" TEXT,
    "linkedin" TEXT,
    "tikTok" TEXT,
    "youtube" TEXT,
    "duree" "duree" NOT NULL,
    "description" TEXT,

    CONSTRAINT "engagement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contenuPartenaire" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "engagementId" INTEGER NOT NULL,

    CONSTRAINT "contenuPartenaire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logo" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "engagementId" INTEGER NOT NULL,

    CONSTRAINT "logo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "categorieArticle" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "image" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "articleId" INTEGER NOT NULL,

    CONSTRAINT "image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" "transactionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "annonceId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_email_key" ON "newsletter"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_phone_key" ON "user"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "company_siret_key" ON "company"("siret");

-- CreateIndex
CREATE UNIQUE INDEX "company_nomSociete_key" ON "company"("nomSociete");

-- CreateIndex
CREATE UNIQUE INDEX "annonces_titre_key" ON "annonces"("titre");

-- CreateIndex
CREATE UNIQUE INDEX "moyenpaiement_cardNumber_key" ON "moyenpaiement"("cardNumber");

-- CreateIndex
CREATE UNIQUE INDEX "moyenpaiement_cardCVC_key" ON "moyenpaiement"("cardCVC");

-- CreateIndex
CREATE UNIQUE INDEX "engagement_nom_key" ON "engagement"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "engagement_email_key" ON "engagement"("email");

-- CreateIndex
CREATE UNIQUE INDEX "engagement_phone_key" ON "engagement"("phone");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profileImage" ADD CONSTRAINT "profileImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "contenuPartenaire" ADD CONSTRAINT "contenuPartenaire_engagementId_fkey" FOREIGN KEY ("engagementId") REFERENCES "engagement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logo" ADD CONSTRAINT "logo_engagementId_fkey" FOREIGN KEY ("engagementId") REFERENCES "engagement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "image" ADD CONSTRAINT "image_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_annonceId_fkey" FOREIGN KEY ("annonceId") REFERENCES "annonces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
