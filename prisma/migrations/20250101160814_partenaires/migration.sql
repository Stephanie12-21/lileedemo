/*
  Warnings:

  - You are about to drop the column `partenariatId` on the `contenuPartenaire` table. All the data in the column will be lost.
  - You are about to drop the column `partenariatId` on the `logo` table. All the data in the column will be lost.
  - You are about to drop the column `partenariatId` on the `videoPartenaire` table. All the data in the column will be lost.
  - You are about to drop the `engagement` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `partenaireId` to the `contenuPartenaire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `partenaireId` to the `logo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `partenaireId` to the `videoPartenaire` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "contenuPartenaire" DROP CONSTRAINT "contenuPartenaire_partenariatId_fkey";

-- DropForeignKey
ALTER TABLE "logo" DROP CONSTRAINT "logo_partenariatId_fkey";

-- DropForeignKey
ALTER TABLE "videoPartenaire" DROP CONSTRAINT "videoPartenaire_partenariatId_fkey";

-- AlterTable
ALTER TABLE "contenuPartenaire" DROP COLUMN "partenariatId",
ADD COLUMN     "partenaireId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "logo" DROP COLUMN "partenariatId",
ADD COLUMN     "partenaireId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "videoPartenaire" DROP COLUMN "partenariatId",
ADD COLUMN     "partenaireId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "engagement";

-- CreateTable
CREATE TABLE "partenaire" (
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

    CONSTRAINT "partenaire_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "partenaire_nom_key" ON "partenaire"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "partenaire_email_key" ON "partenaire"("email");

-- CreateIndex
CREATE UNIQUE INDEX "partenaire_phone_key" ON "partenaire"("phone");

-- AddForeignKey
ALTER TABLE "contenuPartenaire" ADD CONSTRAINT "contenuPartenaire_partenaireId_fkey" FOREIGN KEY ("partenaireId") REFERENCES "partenaire"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videoPartenaire" ADD CONSTRAINT "videoPartenaire_partenaireId_fkey" FOREIGN KEY ("partenaireId") REFERENCES "partenaire"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logo" ADD CONSTRAINT "logo_partenaireId_fkey" FOREIGN KEY ("partenaireId") REFERENCES "partenaire"("id") ON DELETE CASCADE ON UPDATE CASCADE;
