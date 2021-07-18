function DecisionTrees(parent, args, context) {
  return context.prisma.user
    .findUnique({ where: { id: parent.id } })
    .DecisionTrees();
}

module.exports = {
  DecisionTrees,
};
