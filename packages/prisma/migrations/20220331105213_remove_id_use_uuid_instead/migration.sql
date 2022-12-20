/*
  Warnings:

  - The primary key for the `DecisionTree` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `DecisionTree` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DecisionTree" DROP CONSTRAINT "DecisionTree_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "DecisionTree_pkey" PRIMARY KEY ("uuid");
