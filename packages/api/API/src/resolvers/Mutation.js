const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET } = require("../utils");

async function signup(parent, args, context) {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.prisma.user.create({
    data: { ...args, password },
  });

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

async function login(parent, args, context) {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
  });
  if (!user) {
    throw new Error("No such user found");
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  } else {
    const token = jwt.sign({ userId: user.id }, APP_SECRET);

    return {
      token,
      user,
    };
  }
}

async function createTree(parent, args, context) {
  const { userId } = context;

  if (!userId) {
    throw new Error("Unauthorized");
  } else {
    return await context.prisma.decisionTree.create({
      data: {
        //TODO: add properties
        name: args.name,
        tags: args.tags,
        extraData: args.extraData,
        language: args.language,
        owner: { connect: { id: userId } },
      },
    });
  }
}
module.exports = {
  signup,
  login,
  createTree,
};
