import prisma from "src/init-prisma-client";

export const hasPermissionsForTree = async (
  userUuidFromRequest: string,
  treeUuidFromRequest: string
) => {
  const tree = await prisma.decisionTree.findFirst({
    where: {
      uuid: {
        equals: treeUuidFromRequest,
      },
      ownerUuid: {
        equals: userUuidFromRequest,
      },
    },
  });

  if (tree) return true;
  return false;
};
