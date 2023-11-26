/*
  Warnings:

  - You are about to drop the `ReportFiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reports` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ReportFiles" DROP CONSTRAINT "ReportFiles_reportId_fkey";

-- DropForeignKey
ALTER TABLE "Reports" DROP CONSTRAINT "Reports_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Reports" DROP CONSTRAINT "Reports_scheduleId_fkey";

-- AlterTable
ALTER TABLE "Thread" ADD COLUMN     "scheduleId" UUID;

-- DropTable
DROP TABLE "ReportFiles";

-- DropTable
DROP TABLE "Reports";

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedules"("schedId") ON DELETE SET NULL ON UPDATE CASCADE;
