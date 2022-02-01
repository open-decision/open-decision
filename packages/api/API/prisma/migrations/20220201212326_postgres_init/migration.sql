-- DropForeignKey
ALTER TABLE "DecisionTree" DROP CONSTRAINT "DecisionTree_ownerUuid_fkey";

-- AddForeignKey
ALTER TABLE "DecisionTree" ADD CONSTRAINT "DecisionTree_ownerUuid_fkey" FOREIGN KEY ("ownerUuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
