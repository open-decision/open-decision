-- CreateTable
CREATE TABLE "_DecisionTreeToDocumentTemplate" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_DocumentTemplateToPublishedTree" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DecisionTreeToDocumentTemplate_AB_unique" ON "_DecisionTreeToDocumentTemplate"("A", "B");

-- CreateIndex
CREATE INDEX "_DecisionTreeToDocumentTemplate_B_index" ON "_DecisionTreeToDocumentTemplate"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DocumentTemplateToPublishedTree_AB_unique" ON "_DocumentTemplateToPublishedTree"("A", "B");

-- CreateIndex
CREATE INDEX "_DocumentTemplateToPublishedTree_B_index" ON "_DocumentTemplateToPublishedTree"("B");

-- AddForeignKey
ALTER TABLE "_DecisionTreeToDocumentTemplate" ADD CONSTRAINT "_DecisionTreeToDocumentTemplate_A_fkey" FOREIGN KEY ("A") REFERENCES "DecisionTree"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DecisionTreeToDocumentTemplate" ADD CONSTRAINT "_DecisionTreeToDocumentTemplate_B_fkey" FOREIGN KEY ("B") REFERENCES "DocumentTemplate"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentTemplateToPublishedTree" ADD CONSTRAINT "_DocumentTemplateToPublishedTree_A_fkey" FOREIGN KEY ("A") REFERENCES "DocumentTemplate"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocumentTemplateToPublishedTree" ADD CONSTRAINT "_DocumentTemplateToPublishedTree_B_fkey" FOREIGN KEY ("B") REFERENCES "PublishedTree"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
