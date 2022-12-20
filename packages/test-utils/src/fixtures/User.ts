import { User as UserType, Role } from "@prisma/client";
import prisma from "../utils/prismaClient";
import { createUserFixture, insertUsers } from "./user.fixture";
import { Prisma } from "@prisma/client";

export type TUser = UserType;

export class UserFixture {
  private createdUsers: TUser[] = [];

  create = createUserFixture;

  async insert(user?: UserType) {
    const userToInsert = user || this.create();
    await insertUsers([userToInsert]);

    this.createdUsers.push(userToInsert);

    return userToInsert;
  }

  async insertDeveloper(user?: UserType) {
    const userToInsert = user
      ? { ...user, role: Role["DEVELOPER"] }
      : this.create({ role: Role["DEVELOPER"] });
    return this.insert(userToInsert);
  }

  async insertAdmin(user?: UserType) {
    const userToInsert = user
      ? { ...user, role: Role["ADMIN"] }
      : this.create({ role: Role["ADMIN"] });
    return this.insert(userToInsert);
  }

  async remove(userUuid: string) {
    try {
      await prisma.user.delete({ where: { uuid: userUuid } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        return;
      } else {
        throw e;
      }
    }
  }

  async cleanup() {
    for (const user of this.createdUsers) {
      await this.remove(user.uuid);
    }
  }
}
