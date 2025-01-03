/*
  Warnings:

  - You are about to drop the column `partenaireId` on the `contenuPartenaire` table. All the data in the column will be lost.
  - You are about to drop the column `partenaireId` on the `logo` table. All the data in the column will be lost.
  - Added the required column `engagementId` to the `contenuPartenaire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `engagementId` to the `logo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "contenuPartenaire" DROP CONSTRAINT "contenuPartenaire_partenaireId_fkey";

-- DropForeignKey
ALTER TABLE "logo" DROP CONSTRAINT "logo_partenaireId_fkey";

-- AlterTable
ALTER TABLE "contenuPartenaire" DROP COLUMN "partenaireId",
ADD COLUMN     "engagementId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "logo" DROP COLUMN "partenaireId",
ADD COLUMN     "engagementId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "contenuPartenaire" ADD CONSTRAINT "contenuPartenaire_engagementId_fkey" FOREIGN KEY ("engagementId") REFERENCES "engagement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logo" ADD CONSTRAINT "logo_engagementId_fkey" FOREIGN KEY ("engagementId") REFERENCES "engagement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
