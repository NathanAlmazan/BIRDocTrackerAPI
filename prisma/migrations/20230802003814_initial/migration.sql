-- CreateTable
CREATE TABLE "BirOffices" (
    "officeId" SERIAL NOT NULL,
    "officeName" VARCHAR(100) NOT NULL,

    CONSTRAINT "BirOffices_pkey" PRIMARY KEY ("officeId")
);

-- CreateTable
CREATE TABLE "OfficeSections" (
    "sectionId" SERIAL NOT NULL,
    "sectionName" VARCHAR(100) NOT NULL,
    "officeId" INTEGER NOT NULL,

    CONSTRAINT "OfficeSections_pkey" PRIMARY KEY ("sectionId")
);

-- CreateTable
CREATE TABLE "DocumentTypes" (
    "docId" SERIAL NOT NULL,
    "docType" VARCHAR(100) NOT NULL,

    CONSTRAINT "DocumentTypes_pkey" PRIMARY KEY ("docId")
);

-- CreateTable
CREATE TABLE "DocumentStatus" (
    "statusId" SERIAL NOT NULL,
    "statusLabel" VARCHAR(50) NOT NULL,

    CONSTRAINT "DocumentStatus_pkey" PRIMARY KEY ("statusId")
);

-- CreateTable
CREATE TABLE "UserAccounts" (
    "accountId" UUID NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "position" VARCHAR(50) NOT NULL,
    "officeId" INTEGER NOT NULL,
    "password" TEXT NOT NULL,
    "resetCode" VARCHAR(6),

    CONSTRAINT "UserAccounts_pkey" PRIMARY KEY ("accountId")
);

-- CreateTable
CREATE TABLE "Thread" (
    "refId" UUID NOT NULL,
    "subject" VARCHAR(150) NOT NULL,
    "revision" INTEGER NOT NULL DEFAULT 0,
    "authorId" UUID NOT NULL,
    "statusId" INTEGER NOT NULL,
    "recipientId" INTEGER NOT NULL,
    "docTypeId" INTEGER NOT NULL,
    "attachments" BOOLEAN NOT NULL DEFAULT true,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Thread_pkey" PRIMARY KEY ("refId")
);

-- CreateTable
CREATE TABLE "Messages" (
    "msgId" BIGSERIAL NOT NULL,
    "refId" UUID NOT NULL,
    "senderId" UUID NOT NULL,
    "message" TEXT NOT NULL,
    "dateSent" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("msgId")
);

-- CreateTable
CREATE TABLE "MessageFiles" (
    "fileId" BIGSERIAL NOT NULL,
    "msgId" BIGINT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileName" VARCHAR(50) NOT NULL,
    "fileType" VARCHAR(5) NOT NULL,

    CONSTRAINT "MessageFiles_pkey" PRIMARY KEY ("fileId")
);

-- AddForeignKey
ALTER TABLE "OfficeSections" ADD CONSTRAINT "OfficeSections_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "BirOffices"("officeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAccounts" ADD CONSTRAINT "UserAccounts_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "OfficeSections"("sectionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "UserAccounts"("accountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "DocumentStatus"("statusId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "OfficeSections"("sectionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_docTypeId_fkey" FOREIGN KEY ("docTypeId") REFERENCES "DocumentTypes"("docId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "UserAccounts"("accountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_refId_fkey" FOREIGN KEY ("refId") REFERENCES "Thread"("refId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageFiles" ADD CONSTRAINT "MessageFiles_msgId_fkey" FOREIGN KEY ("msgId") REFERENCES "Messages"("msgId") ON DELETE RESTRICT ON UPDATE CASCADE;
