/*
  Warnings:

  - You are about to drop the `partenariat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "contenuPartenaire" DROP CONSTRAINT "contenuPartenaire_partenariatId_fkey";

-- DropForeignKey
ALTER TABLE "logo" DROP CONSTRAINT "logo_partenariatId_fkey";

-- DropForeignKey
ALTER TABLE "videoPartenaire" DROP CONSTRAINT "videoPartenaire_partenariatId_fkey";

-- DropTable
DROP TABLE "partenariat";

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
ALTER TABLE "contenuPartenaire" ADD CONSTRAINT "contenuPartenaire_partenariatId_fkey" FOREIGN KEY ("partenariatId") REFERENCES "engagement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videoPartenaire" ADD CONSTRAINT "videoPartenaire_partenariatId_fkey" FOREIGN KEY ("partenariatId") REFERENCES "engagement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logo" ADD CONSTRAINT "logo_partenariatId_fkey" FOREIGN KEY ("partenariatId") REFERENCES "engagement"("id") ON DELETE CASCADE ON UPDATE CASCADE;