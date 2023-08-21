/*
  Warnings:

  - You are about to drop the column `admin` on the `OfficeSections` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OfficeSections" DROP COLUMN "admin";

-- AlterTable
ALTER TABLE "Roles" ADD COLUMN     "superuser" BOOLEAN NOT NULL DEFAULT false;
