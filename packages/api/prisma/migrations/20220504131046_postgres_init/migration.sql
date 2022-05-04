/*
  Warnings:

  - You are about to drop the column `email` on the `WhitelistEntry` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[emailOrDomain]` on the table `WhitelistEntry` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `emailOrDomain` to the `WhitelistEntry` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WhitelistingType" AS ENUM ('INDIVIDUAL', 'DOMAIN');

-- DropIndex
DROP INDEX "WhitelistEntry_email_key";

-- AlterTable
ALTER TABLE "WhitelistEntry" DROP COLUMN "email",
ADD COLUMN     "emailOrDomain" TEXT NOT NULL,
ADD COLUMN     "type" "WhitelistingType" NOT NULL DEFAULT E'INDIVIDUAL';

-- CreateIndex
CREATE UNIQUE INDEX "WhitelistEntry_emailOrDomain_key" ON "WhitelistEntry"("emailOrDomain");
