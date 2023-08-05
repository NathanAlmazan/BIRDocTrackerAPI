-- DropForeignKey
ALTER TABLE "OfficeSections" DROP CONSTRAINT "OfficeSections_officeId_fkey";

-- AddForeignKey
ALTER TABLE "OfficeSections" ADD CONSTRAINT "OfficeSections_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "BirOffices"("officeId") ON DELETE CASCADE ON UPDATE CASCADE;
