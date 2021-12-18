-- DropForeignKey
ALTER TABLE "DecisionTree" DROP CONSTRAINT "DecisionTree_ownerUuid_fkey";

-- AddForeignKey
ALTER TABLE "DecisionTree" ADD CONSTRAINT "DecisionTree_ownerUuid_fkey" FOREIGN KEY ("ownerUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "Token.id_unique" RENAME TO "Token_id_key";

-- RenameIndex
ALTER INDEX "User.email_unique" RENAME TO "User_email_key";

-- RenameIndex
ALTER INDEX "User.id_unique" RENAME TO "User_id_key";
