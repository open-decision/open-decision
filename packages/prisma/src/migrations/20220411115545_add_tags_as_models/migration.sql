/*
  Warnings:

  - You are about to drop the column `tags` on the `DecisionTree` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TagType" AS ENUM ('SYSTEM', 'USER');

-- AlterTable
ALTER TABLE "DecisionTree" DROP COLUMN "tags";

-- CreateTable
CREATE TABLE "UserTag" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "color" TEXT,
    "ownerUuid" UUID,

    CONSTRAINT "UserTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemTag" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "color" TEXT,

    CONSTRAINT "SystemTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DecisionTreeToSystemTag" (
    "A" UUID NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_DecisionTreeToUserTag" (
    "A" UUID NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DecisionTreeToSystemTag_AB_unique" ON "_DecisionTreeToSystemTag"("A", "B");

-- CreateIndex
CREATE INDEX "_DecisionTreeToSystemTag_B_index" ON "_DecisionTreeToSystemTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DecisionTreeToUserTag_AB_unique" ON "_DecisionTreeToUserTag"("A", "B");

-- CreateIndex
CREATE INDEX "_DecisionTreeToUserTag_B_index" ON "_DecisionTreeToUserTag"("B");

-- AddForeignKey
ALTER TABLE "UserTag" ADD CONSTRAINT "UserTag_ownerUuid_fkey" FOREIGN KEY ("ownerUuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DecisionTreeToSystemTag" ADD FOREIGN KEY ("A") REFERENCES "DecisionTree"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DecisionTreeToSystemTag" ADD FOREIGN KEY ("B") REFERENCES "SystemTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DecisionTreeToUserTag" ADD FOREIGN KEY ("A") REFERENCES "DecisionTree"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DecisionTreeToUserTag" ADD FOREIGN KEY ("B") REFERENCES "UserTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
