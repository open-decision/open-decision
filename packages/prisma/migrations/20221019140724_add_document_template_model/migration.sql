-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('DOCX');

-- CreateTable
CREATE TABLE "DocumentTemplate" (
    "uuid" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "displayName" TEXT NOT NULL,
    "fileType" "FileType" NOT NULL,
    "ownerUuid" UUID NOT NULL,
    "storagePath" TEXT,

    CONSTRAINT "DocumentTemplate_pkey" PRIMARY KEY ("uuid")
);

-- AddForeignKey
ALTER TABLE "DocumentTemplate" ADD CONSTRAINT "DocumentTemplate_ownerUuid_fkey" FOREIGN KEY ("ownerUuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
