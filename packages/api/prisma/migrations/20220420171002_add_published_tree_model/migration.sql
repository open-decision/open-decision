-- CreateTable
CREATE TABLE "PublishedTree" (
    "uuid" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "treeData" JSONB,
    "ownerUuid" UUID NOT NULL,

    CONSTRAINT "PublishedTree_pkey" PRIMARY KEY ("uuid")
);

-- AddForeignKey
ALTER TABLE "PublishedTree" ADD CONSTRAINT "PublishedTree_ownerUuid_fkey" FOREIGN KEY ("ownerUuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
