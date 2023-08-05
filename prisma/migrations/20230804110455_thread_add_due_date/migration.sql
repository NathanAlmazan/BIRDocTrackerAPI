/*
  Warnings:

  - Added the required column `dateDue` to the `Thread` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Thread" ADD COLUMN     "dateDue" TIMESTAMP(3) NOT NULL;
