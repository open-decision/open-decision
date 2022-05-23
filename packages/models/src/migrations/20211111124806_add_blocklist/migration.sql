-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordResetCode" TEXT,
ADD COLUMN     "passwordResetExpiry" INTEGER;

-- CreateTable
CREATE TABLE "blockedAccessToken" (
    "token" TEXT NOT NULL,
    "uuid" UUID NOT NULL,
    "expiry" INTEGER NOT NULL,

    PRIMARY KEY ("token")
);

-- CreateIndex
CREATE UNIQUE INDEX "blockedAccessToken.token_unique" ON "blockedAccessToken"("token");
