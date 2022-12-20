/*
  Warnings:

  - You are about to drop the column `storagePath` on the `DocumentTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `storagePath` on the `PublishedTemplate` table. All the data in the column will be lost.
  - Added the required column `s3Key` to the `DocumentTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `s3bucketName` to the `DocumentTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `s3Key` to the `PublishedTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `s3bucketName` to the `PublishedTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DocumentTemplate" DROP COLUMN "storagePath",
ADD COLUMN     "fullS3Path" TEXT,
ADD COLUMN     "s3Key" TEXT NOT NULL,
ADD COLUMN     "s3bucketName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PublishedTemplate" DROP COLUMN "storagePath",
ADD COLUMN     "fullS3Path" TEXT,
ADD COLUMN     "s3Key" TEXT NOT NULL,
ADD COLUMN     "s3bucketName" TEXT NOT NULL;
