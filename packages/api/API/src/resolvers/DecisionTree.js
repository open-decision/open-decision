function owner(parent, args, context) {
  return context.prisma.decisionTree
    .findUnique({ where: { id: parent.id } })
    .owner();
}

module.exports = {
  owner,
};
