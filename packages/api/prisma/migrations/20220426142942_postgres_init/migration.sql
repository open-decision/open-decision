-- CreateTable
CREATE TABLE "WhitelistEntry" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creatorUuid" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "sendInvite" BOOLEAN NOT NULL DEFAULT false,
    "dateOfLastInvite" TIMESTAMP(3)
);

-- CreateIndex
CREATE UNIQUE INDEX "WhitelistEntry_id_key" ON "WhitelistEntry"("id");

-- CreateIndex
CREATE UNIQUE INDEX "WhitelistEntry_email_key" ON "WhitelistEntry"("email");

-- AddForeignKey
ALTER TABLE "WhitelistEntry" ADD CONSTRAINT "WhitelistEntry_creatorUuid_fkey" FOREIGN KEY ("creatorUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
