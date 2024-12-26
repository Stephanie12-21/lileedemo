-- CreateEnum
CREATE TYPE "statutUser" AS ENUM ('ACTIF', 'SUSPENDU');

-- CreateEnum
CREATE TYPE "secteurActivite" AS ENUM ('IMMOBILIER', 'VETEMENT', 'EMPLOI', 'SERVICE', 'VOITURE', 'LOISIR', 'MATERIEL', 'MOBILIER');

-- CreateEnum
CREATE TYPE "role" AS ENUM ('PERSO', 'PRO', 'ADMIN');

-- CreateEnum
CREATE TYPE "typeSociete" AS ENUM ('ENTREPRISE_INDIVIDUELLE', 'SOCIETE_PRIVEE', 'SOCIETE_PUBLIQUE', 'COOPERATIVE', 'ASSOCIATION');

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

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_phone_key" ON "user"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "company_siret_key" ON "company"("siret");

-- CreateIndex
CREATE UNIQUE INDEX "company_nomSociete_key" ON "company"("nomSociete");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profileImage" ADD CONSTRAINT "profileImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
