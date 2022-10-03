-- CreateTable
CREATE TABLE `User` (
    `username` VARCHAR(255) NOT NULL,
    `age` INTEGER NOT NULL,

    PRIMARY KEY (`username`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Level` (
    `id` SMALLINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Score` (
    `generalScore` SMALLINT NOT NULL,
    `productionScore` SMALLINT NOT NULL,
    `healthScore` SMALLINT NOT NULL,
    `familyScore` SMALLINT NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `levelId` SMALLINT NOT NULL,

    PRIMARY KEY (`username`, `levelId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Score` ADD CONSTRAINT `Score_username_fkey` FOREIGN KEY (`username`) REFERENCES `User`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Score` ADD CONSTRAINT `Score_levelId_fkey` FOREIGN KEY (`levelId`) REFERENCES `Level`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
