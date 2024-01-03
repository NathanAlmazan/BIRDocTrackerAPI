-- DropForeignKey
ALTER TABLE "MessageFiles" DROP CONSTRAINT "MessageFiles_msgId_fkey";

-- AddForeignKey
ALTER TABLE "MessageFiles" ADD CONSTRAINT "MessageFiles_msgId_fkey" FOREIGN KEY ("msgId") REFERENCES "Messages"("msgId") ON DELETE CASCADE ON UPDATE CASCADE;
