/*
  Warnings:

  - You are about to drop the `partenaire` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `videoPartenaire` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "contenuPartenaire" DROP CONSTRAINT "contenuPartenaire_partenaireId_fkey";

-- DropForeignKey
ALTER TABLE "logo" DROP CONSTRAINT "logo_partenaireId_fkey";

-- DropForeignKey
ALTER TABLE "videoPartenaire" DROP CONSTRAINT "videoPartenaire_partenaireId_fkey";

-- DropTable
DROP TABLE "partenaire";

-- DropTable
DROP TABLE "videoPartenaire";

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

-- CreateIndex
CREATE UNIQUE INDEX "engagement_nom_key" ON "engagement"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "engagement_email_key" ON "engagement"("email");

-- CreateIndex
CREATE UNIQUE INDEX "engagement_phone_key" ON "engagement"("phone");

-- AddForeignKey
ALTER TABLE "contenuPartenaire" ADD CONSTRAINT "contenuPartenaire_partenaireId_fkey" FOREIGN KEY ("partenaireId") REFERENCES "engagement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logo" ADD CONSTRAINT "logo_partenaireId_fkey" FOREIGN KEY ("partenaireId") REFERENCES "engagement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
