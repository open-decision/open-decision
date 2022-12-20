/*
  Warnings:

  - Added the required column `treeUuid` to the `DecisionTree` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DecisionTree" ADD COLUMN     "treeUuid" UUID NOT NULL;
