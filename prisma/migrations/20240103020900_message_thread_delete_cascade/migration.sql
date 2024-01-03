-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_refId_fkey";

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_refId_fkey" FOREIGN KEY ("refId") REFERENCES "Thread"("refId") ON DELETE CASCADE ON UPDATE CASCADE;
