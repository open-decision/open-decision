/*
  Warnings:

  - You are about to drop the column `loginExpiry` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordResetCode` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordResetExpiry` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `refreshTokenExpiry` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `blockedAccessToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('ACCESS', 'REFRESH', 'RESET_PASSWORD', 'VERIFY_EMAIL');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "loginExpiry",
DROP COLUMN "passwordResetCode",
DROP COLUMN "passwordResetExpiry",
DROP COLUMN "refreshToken",
DROP COLUMN "refreshTokenExpiry",
ADD COLUMN     "emailIsVerified" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "blockedAccessToken";

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "ownerUuid" UUID NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "loginExpiry" TIMESTAMP(3),
    "blacklisted" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Token.id_unique" ON "Token"("id");

-- AddForeignKey
ALTER TABLE "Token" ADD FOREIGN KEY ("ownerUuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
