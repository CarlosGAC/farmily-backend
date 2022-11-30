/*
  Warnings:

  - The primary key for the `Score` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `healthScore` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the column `levelId` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Score` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `username` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(20)`.
  - You are about to drop the `Level` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `economyScore` to the `Score` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gameplayLevelId` to the `Score` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sustainabilityScore` to the `Score` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Score` table without a default value. This is not possible if the table is not empty.
  - Added the required column `levelProgress` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userLevel` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Score` DROP FOREIGN KEY `Score_levelId_fkey`;

-- DropForeignKey
ALTER TABLE `Score` DROP FOREIGN KEY `Score_username_fkey`;

-- AlterTable
ALTER TABLE `Score` DROP PRIMARY KEY,
    DROP COLUMN `healthScore`,
    DROP COLUMN `levelId`,
    DROP COLUMN `username`,
    ADD COLUMN `economyScore` SMALLINT NOT NULL,
    ADD COLUMN `gameplayLevelId` SMALLINT NOT NULL,
    ADD COLUMN `sustainabilityScore` SMALLINT NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`userId`, `gameplayLevelId`);

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    ADD COLUMN `levelProgress` INTEGER NOT NULL,
    ADD COLUMN `password` VARCHAR(255) NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `userLevel` SMALLINT NOT NULL,
    MODIFY `username` VARCHAR(20) NOT NULL,
    ADD PRIMARY KEY (`userId`);

-- DropTable
DROP TABLE `Level`;

-- CreateTable
CREATE TABLE `GameplayLevel` (
    `id` SMALLINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Score_gameplayLevelId_idx` ON `Score`(`gameplayLevelId`);

-- CreateIndex
CREATE INDEX `Score_userId_idx` ON `Score`(`userId`);
