/*
  Warnings:

  - A unique constraint covering the columns `[originTreeUuid]` on the table `PublishedTree` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `originTreeUuid` to the `PublishedTree` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PublishedTree" ADD COLUMN     "originTreeUuid" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PublishedTree_originTreeUuid_key" ON "PublishedTree"("originTreeUuid");

-- AddForeignKey
ALTER TABLE "PublishedTree" ADD CONSTRAINT "PublishedTree_originTreeUuid_fkey" FOREIGN KEY ("originTreeUuid") REFERENCES "DecisionTree"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
