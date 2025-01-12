-- CreateTable
CREATE TABLE `newsletter` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `unsubscribeToken` VARCHAR(191) NULL,

    UNIQUE INDEX `newsletter_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `prenom` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `hashPassword` VARCHAR(191) NOT NULL,
    `statutUser` ENUM('ACTIF', 'SUSPENDU') NOT NULL,
    `role` ENUM('PERSO', 'PRO', 'ADMIN') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `companyId` INTEGER NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    UNIQUE INDEX `user_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `company` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `siret` VARCHAR(191) NOT NULL,
    `nomSociete` VARCHAR(191) NOT NULL,
    `codePostal` VARCHAR(191) NOT NULL,
    `adresse` VARCHAR(191) NOT NULL,
    `ville` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `secteurActivite` ENUM('IMMOBILIER', 'VETEMENT', 'EMPLOI', 'SERVICE', 'VOITURE', 'LOISIR', 'MATERIEL', 'MOBILIER') NOT NULL,
    `typeSociete` ENUM('ENTREPRISE_INDIVIDUELLE', 'SOCIETE_PRIVEE', 'SOCIETE_PUBLIQUE', 'COOPERATIVE', 'ASSOCIATION') NOT NULL,

    UNIQUE INDEX `company_siret_key`(`siret`),
    UNIQUE INDEX `company_nomSociete_key`(`nomSociete`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profileImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `path` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `favoris` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `saveDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NOT NULL,
    `annonceId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `annonces` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titre` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `prix` DECIMAL(65, 30) NULL,
    `typeTarif` ENUM('JOURNALIER', 'NUITEE', 'FIXE', 'MENSUEL') NULL,
    `priority` ENUM('URGENT', 'POPULAIRE', 'RECOMMANDATION') NULL,
    `localisation` VARCHAR(191) NULL,
    `adresse` VARCHAR(191) NOT NULL,
    `statut` ENUM('PUBLIEE', 'DESACTIVEE', 'EN_ATTENTE_DE_VALIDATION') NULL DEFAULT 'EN_ATTENTE_DE_VALIDATION',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `categorieAnnonce` ENUM('IMMOBILIER', 'VETEMENT', 'EMPLOI_SERVICE', 'VOITURE', 'LOISIR', 'MATERIEL', 'MOBILIER', 'DONS') NOT NULL,
    `sousCategorie` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `annonces_titre_key`(`titre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `imageAnnonce` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `path` VARCHAR(191) NOT NULL,
    `annoncesId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `commentaire` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `commentaire` VARCHAR(191) NOT NULL,
    `note` INTEGER NULL,
    `annoncesId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `temoignages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `temoignage` VARCHAR(191) NOT NULL,
    `noteLilee` INTEGER NOT NULL,
    `ville` VARCHAR(191) NULL,
    `pays` VARCHAR(191) NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `moyenpaiement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cardNumber` VARCHAR(191) NOT NULL,
    `nameOnCard` VARCHAR(191) NOT NULL,
    `cardCVC` INTEGER NOT NULL,
    `cardExpiry` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `moyenpaiement_cardNumber_key`(`cardNumber`),
    UNIQUE INDEX `moyenpaiement_cardCVC_key`(`cardCVC`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `engagement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `statutPartenaire` ENUM('ACTIF', 'SUSPENDU') NOT NULL DEFAULT 'ACTIF',
    `siteWeb` VARCHAR(191) NULL,
    `adresse` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `facebook` VARCHAR(191) NULL,
    `instagram` VARCHAR(191) NULL,
    `twitter` VARCHAR(191) NULL,
    `linkedin` VARCHAR(191) NULL,
    `tikTok` VARCHAR(191) NULL,
    `youtube` VARCHAR(191) NULL,
    `duree` ENUM('MENSUEL', 'TRIMESTRIEL', 'SEMESTRIEL', 'ANNUEL') NOT NULL,
    `description` VARCHAR(191) NULL,

    UNIQUE INDEX `engagement_nom_key`(`nom`),
    UNIQUE INDEX `engagement_email_key`(`email`),
    UNIQUE INDEX `engagement_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contenuPartenaire` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `path` VARCHAR(191) NOT NULL,
    `engagementId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `logo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `path` VARCHAR(191) NOT NULL,
    `engagementId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `article` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titre` VARCHAR(191) NOT NULL,
    `contenu` VARCHAR(191) NOT NULL,
    `categorieArticle` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `path` VARCHAR(191) NOT NULL,
    `articleId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profileImage` ADD CONSTRAINT `profileImage_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favoris` ADD CONSTRAINT `favoris_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favoris` ADD CONSTRAINT `favoris_annonceId_fkey` FOREIGN KEY (`annonceId`) REFERENCES `annonces`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `annonces` ADD CONSTRAINT `annonces_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `imageAnnonce` ADD CONSTRAINT `imageAnnonce_annoncesId_fkey` FOREIGN KEY (`annoncesId`) REFERENCES `annonces`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `commentaire` ADD CONSTRAINT `commentaire_annoncesId_fkey` FOREIGN KEY (`annoncesId`) REFERENCES `annonces`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `commentaire` ADD CONSTRAINT `commentaire_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `temoignages` ADD CONSTRAINT `temoignages_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `moyenpaiement` ADD CONSTRAINT `moyenpaiement_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contenuPartenaire` ADD CONSTRAINT `contenuPartenaire_engagementId_fkey` FOREIGN KEY (`engagementId`) REFERENCES `engagement`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `logo` ADD CONSTRAINT `logo_engagementId_fkey` FOREIGN KEY (`engagementId`) REFERENCES `engagement`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `image` ADD CONSTRAINT `image_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `article`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
