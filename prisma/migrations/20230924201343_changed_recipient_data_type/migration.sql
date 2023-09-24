/*
  Warnings:

  - The `recipientUserId` column on the `Thread` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Thread" DROP COLUMN "recipientUserId",
ADD COLUMN     "recipientUserId" UUID;
