-- AlterTable
ALTER TABLE "DocumentPurpose" ADD COLUMN     "initStatusId" INTEGER;

-- CreateTable
CREATE TABLE "ThreadHistory" (
    "historyId" BIGSERIAL NOT NULL,
    "historyLabel" VARCHAR(100) NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "threadId" UUID NOT NULL,
    "statusId" INTEGER,

    CONSTRAINT "ThreadHistory_pkey" PRIMARY KEY ("historyId")
);

-- AddForeignKey
ALTER TABLE "DocumentPurpose" ADD CONSTRAINT "DocumentPurpose_initStatusId_fkey" FOREIGN KEY ("initStatusId") REFERENCES "DocumentStatus"("statusId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThreadHistory" ADD CONSTRAINT "ThreadHistory_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("refId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThreadHistory" ADD CONSTRAINT "ThreadHistory_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "DocumentStatus"("statusId") ON DELETE SET NULL ON UPDATE CASCADE;
