/*
  Warnings:

  - Added the required column `purposeId` to the `Thread` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Thread" ADD COLUMN     "purposeId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "DocumentPurpose" (
    "purposeId" SERIAL NOT NULL,
    "purposeName" VARCHAR(50) NOT NULL,
    "actionable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "DocumentPurpose_pkey" PRIMARY KEY ("purposeId")
);

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_purposeId_fkey" FOREIGN KEY ("purposeId") REFERENCES "DocumentPurpose"("purposeId") ON DELETE RESTRICT ON UPDATE CASCADE;
