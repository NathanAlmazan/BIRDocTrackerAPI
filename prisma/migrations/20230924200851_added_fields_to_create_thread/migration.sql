-- AlterTable
ALTER TABLE "Thread" ADD COLUMN     "purposeNotes" TEXT,
ADD COLUMN     "recipientUserId" INTEGER,
ADD COLUMN     "tagId" INTEGER;

-- CreateTable
CREATE TABLE "ThreadTags" (
    "tagId" SERIAL NOT NULL,
    "tagName" VARCHAR(50) NOT NULL,

    CONSTRAINT "ThreadTags_pkey" PRIMARY KEY ("tagId")
);

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "ThreadTags"("tagId") ON DELETE SET NULL ON UPDATE CASCADE;
