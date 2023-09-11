-- AlterTable
ALTER TABLE "OfficeSections" ADD COLUMN     "refNum" TEXT;

-- AlterTable
ALTER TABLE "Thread" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;
