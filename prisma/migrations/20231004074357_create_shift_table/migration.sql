-- CreateTable
CREATE TABLE `Shift` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `start` TIME NOT NULL,
    `end` TIME NOT NULL,
    `day` ENUM('SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT') NOT NULL,

    UNIQUE INDEX `Shift_day_start_key`(`day`, `start`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
