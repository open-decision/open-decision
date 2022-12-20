/*
  Warnings:

  - You are about to drop the `_DecisionTreeToDocumentTemplate` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `treeUuid` to the `DocumentTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_DecisionTreeToDocumentTemplate" DROP CONSTRAINT "_DecisionTreeToDocumentTemplate_A_fkey";

-- DropForeignKey
ALTER TABLE "_DecisionTreeToDocumentTemplate" DROP CONSTRAINT "_DecisionTreeToDocumentTemplate_B_fkey";

-- AlterTable
ALTER TABLE "DocumentTemplate" ADD COLUMN     "treeUuid" UUID NOT NULL;

-- DropTable
DROP TABLE "_DecisionTreeToDocumentTemplate";

-- CreateTable
CREATE TABLE "PublishedTemplate" (
    "uuid" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "displayName" TEXT NOT NULL,
    "fileType" "FileType" NOT NULL,
    "ownerUuid" UUID NOT NULL,
    "storagePath" TEXT,
    "originalDocUuid" UUID NOT NULL,

    CONSTRAINT "PublishedTemplate_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "_PublishedTemplateToPublishedTree" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PublishedTemplateToPublishedTree_AB_unique" ON "_PublishedTemplateToPublishedTree"("A", "B");

-- CreateIndex
CREATE INDEX "_PublishedTemplateToPublishedTree_B_index" ON "_PublishedTemplateToPublishedTree"("B");

-- AddForeignKey
ALTER TABLE "DocumentTemplate" ADD CONSTRAINT "DocumentTemplate_treeUuid_fkey" FOREIGN KEY ("treeUuid") REFERENCES "DecisionTree"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedTemplate" ADD CONSTRAINT "PublishedTemplate_ownerUuid_fkey" FOREIGN KEY ("ownerUuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublishedTemplate" ADD CONSTRAINT "PublishedTemplate_originalDocUuid_fkey" FOREIGN KEY ("originalDocUuid") REFERENCES "DocumentTemplate"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PublishedTemplateToPublishedTree" ADD CONSTRAINT "_PublishedTemplateToPublishedTree_A_fkey" FOREIGN KEY ("A") REFERENCES "PublishedTemplate"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PublishedTemplateToPublishedTree" ADD CONSTRAINT "_PublishedTemplateToPublishedTree_B_fkey" FOREIGN KEY ("B") REFERENCES "PublishedTree"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
