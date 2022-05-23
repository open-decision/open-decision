/*
  Warnings:

  - You are about to drop the `SystemTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DecisionTreeToSystemTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DecisionTreeToUserTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TreeStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- DropForeignKey
ALTER TABLE "UserTag" DROP CONSTRAINT "UserTag_ownerUuid_fkey";

-- DropForeignKey
ALTER TABLE "_DecisionTreeToSystemTag" DROP CONSTRAINT "_DecisionTreeToSystemTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_DecisionTreeToSystemTag" DROP CONSTRAINT "_DecisionTreeToSystemTag_B_fkey";

-- DropForeignKey
ALTER TABLE "_DecisionTreeToUserTag" DROP CONSTRAINT "_DecisionTreeToUserTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_DecisionTreeToUserTag" DROP CONSTRAINT "_DecisionTreeToUserTag_B_fkey";

-- DropIndex
DROP INDEX "Token_id_key";

-- AlterTable
ALTER TABLE "DecisionTree" ADD COLUMN     "status" "TreeStatus" NOT NULL DEFAULT E'ACTIVE';

-- DropTable
DROP TABLE "SystemTag";

-- DropTable
DROP TABLE "UserTag";

-- DropTable
DROP TABLE "_DecisionTreeToSystemTag";

-- DropTable
DROP TABLE "_DecisionTreeToUserTag";

-- DropEnum
DROP TYPE "TagType";

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "color" TEXT,
    "ownerUuid" UUID,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DecisionTreeToTag" (
    "A" UUID NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DecisionTreeToTag_AB_unique" ON "_DecisionTreeToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_DecisionTreeToTag_B_index" ON "_DecisionTreeToTag"("B");

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_ownerUuid_fkey" FOREIGN KEY ("ownerUuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DecisionTreeToTag" ADD FOREIGN KEY ("A") REFERENCES "DecisionTree"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DecisionTreeToTag" ADD FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
