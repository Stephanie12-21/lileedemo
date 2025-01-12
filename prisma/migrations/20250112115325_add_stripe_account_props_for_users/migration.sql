-- AlterTable
ALTER TABLE `user` ADD COLUMN `stripeAccountCompleted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `stripeAccountId` VARCHAR(191) NULL;
