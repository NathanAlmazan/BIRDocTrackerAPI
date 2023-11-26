-- CreateTable
CREATE TABLE "Schedules" (
    "schedId" UUID NOT NULL,
    "subject" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "repeat" VARCHAR(20) NOT NULL,
    "recipientIds" TEXT NOT NULL,
    "dateStart" TIMESTAMP(3) NOT NULL,
    "dateDue" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Schedules_pkey" PRIMARY KEY ("schedId")
);

-- CreateTable
CREATE TABLE "Reports" (
    "reportId" BIGSERIAL NOT NULL,
    "authorId" UUID NOT NULL,
    "scheduleId" UUID NOT NULL,
    "reportDate" TIMESTAMP(3) NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reports_pkey" PRIMARY KEY ("reportId")
);

-- CreateTable
CREATE TABLE "ReportFiles" (
    "fileId" BIGSERIAL NOT NULL,
    "reportId" BIGINT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileName" VARCHAR(150) NOT NULL,
    "fileType" VARCHAR(20) NOT NULL,

    CONSTRAINT "ReportFiles_pkey" PRIMARY KEY ("fileId")
);

-- AddForeignKey
ALTER TABLE "Reports" ADD CONSTRAINT "Reports_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "UserAccounts"("accountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reports" ADD CONSTRAINT "Reports_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedules"("schedId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportFiles" ADD CONSTRAINT "ReportFiles_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Reports"("reportId") ON DELETE RESTRICT ON UPDATE CASCADE;
