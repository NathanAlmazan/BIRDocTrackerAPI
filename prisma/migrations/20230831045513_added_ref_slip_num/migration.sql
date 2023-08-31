/*
  Warnings:

  - Added the required column `refSlipNum` to the `Thread` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BirOffices" ADD COLUMN     "refNum" VARCHAR(10) NOT NULL DEFAULT 'RR6';

-- AlterTable
ALTER TABLE "Thread" ADD COLUMN     "refSlipNum" VARCHAR(20) NOT NULL;
