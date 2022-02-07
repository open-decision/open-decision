import { User } from "@prisma/client";
import prisma from "../../src/init-prisma-client";
import faker from "faker";
const password = "Th@t!shardToGuess";
const hashedPassword =
  "$argon2id$v=19$m=15360,t=2,p=1$G6IkVa7e5SDHgeAGqcATfQ$HpzqEJ8IBkEQWWw2oKHjxlbxx8PQeYhNLh+DoLY8OOc";

export const userOne: User = {
  id: faker.datatype.number(),
  name: faker.name.findName(),
  uuid: faker.datatype.uuid(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: "USER",
  emailIsVerified: false,
};

export const userTwo: User = {
  id: faker.datatype.number(),
  name: faker.name.findName(),
  uuid: faker.datatype.uuid(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: "USER",
  emailIsVerified: false,
};

export const admin: User = {
  id: faker.datatype.number(),
  name: faker.name.findName(),
  uuid: faker.datatype.uuid(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: "ADMIN",
  emailIsVerified: false,
};

export const insertUsers = async (users: User[]) => {
  const mod = users.map((user) => ({ ...user, password: hashedPassword }));

  await prisma.user.createMany({
    data: mod,
  });
};
