/*
  Warnings:

  - You are about to drop the column `posiions` on the `OfficeSections` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OfficeSections" DROP COLUMN "posiions",
ADD COLUMN     "positions" TEXT;
