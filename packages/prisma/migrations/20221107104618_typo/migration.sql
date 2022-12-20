/*
  Warnings:

  - You are about to drop the column `s3bucketName` on the `DocumentTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `s3bucketName` on the `PublishedTemplate` table. All the data in the column will be lost.
  - Added the required column `s3BucketName` to the `DocumentTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `s3BucketName` to the `PublishedTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DocumentTemplate" DROP COLUMN "s3bucketName",
ADD COLUMN     "s3BucketName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PublishedTemplate" DROP COLUMN "s3bucketName",
ADD COLUMN     "s3BucketName" TEXT NOT NULL;
