/*
  Warnings:

  - You are about to drop the column `date` on the `transactions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "date",
ADD COLUMN     "dateRange" JSONB;
