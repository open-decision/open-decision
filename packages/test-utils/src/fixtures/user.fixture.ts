import { User } from "@open-decision/prisma";
import prisma from "../client";
import { faker } from "@faker-js/faker";
const password = "Th@t!shardToGuess";
const hashedPassword =
  "$argon2id$v=19$m=15360,t=2,p=1$G6IkVa7e5SDHgeAGqcATfQ$HpzqEJ8IBkEQWWw2oKHjxlbxx8PQeYhNLh+DoLY8OOc";

export const userOne: User = {
  id: 1,
  name: "Max Mustermann",
  uuid: "71876990-27b7-4d87-9048-338a39fb19d9",
  email: "static@test.com",
  password,
  role: "USER",
  emailIsVerified: false,
};

export const userTwo: User = {
  id: faker.datatype.number(),
  name: faker.name.findName(),
  uuid: "170faab0-0e13-4432-9b48-b4e54baba597",
  email: faker.internet.email().toLowerCase(),
  password,
  role: "USER",
  emailIsVerified: false,
};

export const createUserFixture = (
  user?: Omit<Partial<User>, "password">
): User => {
  faker.seed();

  return {
    id: faker.datatype.number(),
    name: faker.name.findName(),
    uuid: faker.datatype.uuid(),
    email: faker.internet.email().toLowerCase(),
    password,
    role: "USER",
    emailIsVerified: false,
    ...user,
  };
};

export const admin: User = {
  id: faker.datatype.number(),
  name: faker.name.findName(),
  uuid: "a1f13d33-d7c2-4af9-b9c1-c25b099c563e",
  email: faker.internet.email().toLowerCase(),
  password,
  role: "ADMIN",
  emailIsVerified: false,
};

export const developer: User = {
  id: faker.datatype.number(),
  name: faker.name.findName(),
  uuid: "24e34d98-889e-4e3b-a574-af9ff5a844f9",
  email: faker.internet.email().toLowerCase(),
  password,
  role: "DEVELOPER",
  emailIsVerified: false,
};

export const insertUsers = async (users: User[]) => {
  const mod = users.map((user) => ({ ...user, password: hashedPassword }));

  await prisma.user.createMany({
    data: mod,
  });
};
