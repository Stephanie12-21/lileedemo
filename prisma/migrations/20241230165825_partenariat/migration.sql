/*
  Warnings:

  - You are about to drop the column `partenaireId` on the `contenuPartenaire` table. All the data in the column will be lost.
  - You are about to drop the column `partenaireId` on the `logo` table. All the data in the column will be lost.
  - You are about to drop the column `partenaireId` on the `videoPartenaire` table. All the data in the column will be lost.
  - You are about to drop the `partenaire` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `partenariatId` to the `contenuPartenaire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `partenariatId` to the `logo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `partenariatId` to the `videoPartenaire` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "contenuPartenaire" DROP CONSTRAINT "contenuPartenaire_partenaireId_fkey";

-- DropForeignKey
ALTER TABLE "logo" DROP CONSTRAINT "logo_partenaireId_fkey";

-- DropForeignKey
ALTER TABLE "videoPartenaire" DROP CONSTRAINT "videoPartenaire_partenaireId_fkey";

-- AlterTable
ALTER TABLE "contenuPartenaire" DROP COLUMN "partenaireId",
ADD COLUMN     "partenariatId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "logo" DROP COLUMN "partenaireId",
ADD COLUMN     "partenariatId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "videoPartenaire" DROP COLUMN "partenaireId",
ADD COLUMN     "partenariatId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "partenaire";

-- CreateTable
CREATE TABLE "partenariat" (
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

    CONSTRAINT "partenariat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "partenariat_nom_key" ON "partenariat"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "partenariat_email_key" ON "partenariat"("email");

-- CreateIndex
CREATE UNIQUE INDEX "partenariat_phone_key" ON "partenariat"("phone");

-- AddForeignKey
ALTER TABLE "contenuPartenaire" ADD CONSTRAINT "contenuPartenaire_partenariatId_fkey" FOREIGN KEY ("partenariatId") REFERENCES "partenariat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videoPartenaire" ADD CONSTRAINT "videoPartenaire_partenariatId_fkey" FOREIGN KEY ("partenariatId") REFERENCES "partenariat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logo" ADD CONSTRAINT "logo_partenariatId_fkey" FOREIGN KEY ("partenariatId") REFERENCES "partenariat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
