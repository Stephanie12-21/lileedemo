/*
  Warnings:

  - You are about to drop the `annonces` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `article` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `commentaire` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `company` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `contenuPartenaire` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `engagement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `favoris` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `imageAnnonce` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `logo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `moyenpaiement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `newsletter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `profileImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `temoignages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transactions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "annonces" DROP CONSTRAINT "annonces_userId_fkey";

-- DropForeignKey
ALTER TABLE "commentaire" DROP CONSTRAINT "commentaire_annoncesId_fkey";

-- DropForeignKey
ALTER TABLE "commentaire" DROP CONSTRAINT "commentaire_userId_fkey";

-- DropForeignKey
ALTER TABLE "contenuPartenaire" DROP CONSTRAINT "contenuPartenaire_engagementId_fkey";

-- DropForeignKey
ALTER TABLE "favoris" DROP CONSTRAINT "favoris_annonceId_fkey";

-- DropForeignKey
ALTER TABLE "favoris" DROP CONSTRAINT "favoris_userId_fkey";

-- DropForeignKey
ALTER TABLE "image" DROP CONSTRAINT "image_articleId_fkey";

-- DropForeignKey
ALTER TABLE "imageAnnonce" DROP CONSTRAINT "imageAnnonce_annoncesId_fkey";

-- DropForeignKey
ALTER TABLE "logo" DROP CONSTRAINT "logo_engagementId_fkey";

-- DropForeignKey
ALTER TABLE "moyenpaiement" DROP CONSTRAINT "moyenpaiement_userId_fkey";

-- DropForeignKey
ALTER TABLE "profileImage" DROP CONSTRAINT "profileImage_userId_fkey";

-- DropForeignKey
ALTER TABLE "temoignages" DROP CONSTRAINT "temoignages_userId_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_annonceId_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_userId_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_companyId_fkey";

-- DropTable
DROP TABLE "annonces";

-- DropTable
DROP TABLE "article";

-- DropTable
DROP TABLE "commentaire";

-- DropTable
DROP TABLE "company";

-- DropTable
DROP TABLE "contenuPartenaire";

-- DropTable
DROP TABLE "engagement";

-- DropTable
DROP TABLE "favoris";

-- DropTable
DROP TABLE "image";

-- DropTable
DROP TABLE "imageAnnonce";

-- DropTable
DROP TABLE "logo";

-- DropTable
DROP TABLE "moyenpaiement";

-- DropTable
DROP TABLE "newsletter";

-- DropTable
DROP TABLE "profileImage";

-- DropTable
DROP TABLE "temoignages";

-- DropTable
DROP TABLE "transactions";

-- DropTable
DROP TABLE "user";

-- DropEnum
DROP TYPE "categorieAnnonce";

-- DropEnum
DROP TYPE "duree";

-- DropEnum
DROP TYPE "priority";

-- DropEnum
DROP TYPE "role";

-- DropEnum
DROP TYPE "secteurActivite";

-- DropEnum
DROP TYPE "statut";

-- DropEnum
DROP TYPE "statutPartenaire";

-- DropEnum
DROP TYPE "statutUser";

-- DropEnum
DROP TYPE "transactionStatus";

-- DropEnum
DROP TYPE "typeSociete";

-- DropEnum
DROP TYPE "typeTarif";
