/*
  Warnings:

  - You are about to drop the column `author` on the `Reports` table. All the data in the column will be lost.
  - You are about to drop the column `scheduleId` on the `Thread` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schedId` to the `Reports` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Thread" DROP CONSTRAINT "Thread_scheduleId_fkey";

-- AlterTable
ALTER TABLE "Reports" DROP COLUMN "author",
ADD COLUMN     "authorId" UUID NOT NULL,
ADD COLUMN     "schedId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Thread" DROP COLUMN "scheduleId";

-- AddForeignKey
ALTER TABLE "Reports" ADD CONSTRAINT "Reports_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "UserAccounts"("accountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reports" ADD CONSTRAINT "Reports_schedId_fkey" FOREIGN KEY ("schedId") REFERENCES "Schedules"("schedId") ON DELETE RESTRICT ON UPDATE CASCADE;
