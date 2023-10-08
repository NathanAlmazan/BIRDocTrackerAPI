/*
  Warnings:

  - You are about to drop the column `actionable` on the `DocumentPurpose` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DocumentPurpose" DROP COLUMN "actionable";

-- AlterTable
ALTER TABLE "DocumentTypes" ADD COLUMN     "actionable" BOOLEAN NOT NULL DEFAULT true;
