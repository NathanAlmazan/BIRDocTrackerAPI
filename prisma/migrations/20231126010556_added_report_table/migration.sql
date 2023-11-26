-- CreateTable
CREATE TABLE "Reports" (
    "reportId" BIGSERIAL NOT NULL,
    "reportDate" TIMESTAMP(3) NOT NULL,
    "author" UUID NOT NULL,
    "message" TEXT,

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
ALTER TABLE "ReportFiles" ADD CONSTRAINT "ReportFiles_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Reports"("reportId") ON DELETE RESTRICT ON UPDATE CASCADE;
