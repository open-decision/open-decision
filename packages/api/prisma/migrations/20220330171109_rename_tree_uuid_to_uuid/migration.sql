/*
  Warnings:

  - You are about to drop the column `treeUuid` on the `DecisionTree` table. All the data in the column will be lost.
  - The required column `uuid` was added to the `DecisionTree` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "DecisionTree" DROP COLUMN "treeUuid",
ADD COLUMN     "uuid" UUID NOT NULL;
