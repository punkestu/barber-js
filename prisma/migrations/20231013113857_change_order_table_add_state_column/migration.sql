-- AlterTable
ALTER TABLE `Order` ADD COLUMN `state` ENUM('ORDERED', 'ACCEPTED', 'EXPIRED') NOT NULL DEFAULT 'ORDERED';
