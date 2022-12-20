/*
  Warnings:

  - You are about to drop the column `originalDocUuid` on the `PublishedTemplate` table. All the data in the column will be lost.
  - You are about to drop the `_PublishedTemplateToPublishedTree` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `originalTemplateUuid` to the `PublishedTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publishedTreeUuid` to the `PublishedTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PublishedTemplate" DROP CONSTRAINT "PublishedTemplate_originalDocUuid_fkey";

-- DropForeignKey
ALTER TABLE "_PublishedTemplateToPublishedTree" DROP CONSTRAINT "_PublishedTemplateToPublishedTree_A_fkey";

-- DropForeignKey
ALTER TABLE "_PublishedTemplateToPublishedTree" DROP CONSTRAINT "_PublishedTemplateToPublishedTree_B_fkey";

-- AlterTable
ALTER TABLE "PublishedTemplate" DROP COLUMN "originalDocUuid",
ADD COLUMN     "originalTemplateUuid" UUID NOT NULL,
ADD COLUMN     "publishedTreeUuid" UUID NOT NULL;

-- DropTable
DROP TABLE "_PublishedTemplateToPublishedTree";

-- AddForeignKey
ALTER TABLE "PublishedTemplate" ADD CONSTRAINT "PublishedTemplate_originalTemplateUuid_fkey" FOREIGN KEY ("originalTemplateUuid") REFERENCES "DocumentTemplate"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedTemplate" ADD CONSTRAINT "PublishedTemplate_publishedTreeUuid_fkey" FOREIGN KEY ("publishedTreeUuid") REFERENCES "PublishedTree"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
