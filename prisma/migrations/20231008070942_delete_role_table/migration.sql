/*
  Warnings:

  - You are about to drop the column `role_id` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `role` to the `Person` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Person` DROP FOREIGN KEY `Person_role_id_fkey`;

-- AlterTable
ALTER TABLE `Person` DROP COLUMN `role_id`,
    ADD COLUMN `role` ENUM('CLIENT', 'BARBER', 'ADMIN') NOT NULL;

-- DropTable
DROP TABLE `Role`;
