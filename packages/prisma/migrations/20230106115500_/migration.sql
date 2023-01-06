/*
  Warnings:

  - A unique constraint covering the columns `[nextTokenId]` on the table `Token` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Token" ADD COLUMN     "deleteAfter" TIMESTAMP(3),
ADD COLUMN     "nextTokenId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Token_nextTokenId_key" ON "Token"("nextTokenId");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_nextTokenId_fkey" FOREIGN KEY ("nextTokenId") REFERENCES "Token"("id") ON DELETE SET NULL ON UPDATE CASCADE;
