function getTrees(parent, args, context) {
  const { userId } = context;

  if (!userId) {
    throw new Error("Unauthorized");
  } else {
    return context.prisma.decisionTree.findMany({
      where: { owner: { id: userId } },
    });
  }
}
module.exports = {
  getTrees,
};
