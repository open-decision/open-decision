import { User } from "@prisma/client";
import { prisma } from "../utils";
import {
  createTreeFixture,
  insertTrees,
  PartialTree,
} from "./decisionTree.fixture";
import { TClient } from "@open-decision/api-client";
import { TUser } from "./User";
import { Prisma } from "@prisma/client";

export const createDefaultSetOfTrees = async (
  Trees: TreeFixture,
  user: User
) => {
  const activeTree = await Trees.insert(
    user,
    Trees.create({
      name: "This is an active tree",
      createdAt: new Date("2020-01-01T00:00:00.000Z"),
      updatedAt: new Date("2022-01-01T00:00:00.000Z"),
      status: "ACTIVE",
    })
  );

  const activePublishedTree = await Trees.insert(
    user,
    Trees.create({
      name: "This is an active and published tree",
      createdAt: new Date("2020-01-01T00:00:00.000Z"),
      updatedAt: new Date("2022-01-01T00:00:00.000Z"),
      status: "ACTIVE",
    })
  );

  const activeEmptyTree = await Trees.insert(
    user,
    Trees.create({
      name: "This is an active and empty tree",
      yDocument: "",
      createdAt: new Date("2021-01-01T00:00:00.000Z"),
      updatedAt: new Date("2020-01-01T00:00:00.000Z"),
      status: "ACTIVE",
    })
  );

  const archivedTree = await Trees.insert(
    user,
    Trees.create({
      name: "This is an archived tree",
      createdAt: new Date("2020-01-01T00:00:00.000Z"),
      updatedAt: new Date("2022-01-01T00:00:00.000Z"),
      status: "ARCHIVED",
    })
  );

  const archivedPublishedTree = await Trees.insert(
    user,
    Trees.create({
      name: "This is an archived and published tree",
      createdAt: new Date("2020-01-01T00:00:00.000Z"),
      updatedAt: new Date("2022-01-01T00:00:00.000Z"),
      status: "ARCHIVED",
    })
  );

  const archivedEmptyTree = await Trees.insert(
    user,
    Trees.create({
      name: "This is an archived and empty tree",
      yDocument: "",
      createdAt: new Date("2021-01-01T00:00:00.000Z"),
      updatedAt: new Date("2020-01-01T00:00:00.000Z"),
      status: "ARCHIVED",
    })
  );

  const publishedTree = await Trees.publish(
    activePublishedTree.uuid,
    "Published Tree"
  );
  const publishedTreeArchived = await Trees.publish(
    archivedPublishedTree.uuid,
    "Published Tree Two"
  );

  return {
    activeTree,
    activePublishedTree,
    activeEmptyTree,
    archivedTree,
    archivedPublishedTree,
    archivedEmptyTree,
    publishedTree,
    publishedTreeArchived,
  };
};

export class TreeFixture {
  private odClient: TClient;
  private createdTrees: string[] = [];
  private createdPublishedTrees: string[] = [];

  constructor(odClient: TClient) {
    this.odClient = odClient;
  }

  create = createTreeFixture;

  async insert(user: TUser, tree?: PartialTree) {
    const treeToInsert = tree ?? this.create();
    await insertTrees(user.uuid, [treeToInsert]);

    this.createdTrees.push(treeToInsert.uuid);

    return treeToInsert;
  }

  async publish(treeUuid: string, name?: string) {
    const publishedTree = await this.odClient.trees.publishedTrees.create({
      params: { treeUuid },
      body: { name: name ?? "Published Tree" },
    });

    this.createdPublishedTrees.push(publishedTree.data.uuid);
    return publishedTree.data;
  }

  async remove(treeUuid: string) {
    try {
      await prisma.decisionTree.delete({ where: { uuid: treeUuid } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        return;
      } else {
        throw e;
      }
    }
  }

  async removePublished(treeUuid: string) {
    try {
      await prisma.publishedTree.delete({ where: { uuid: treeUuid } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        return;
      } else {
        throw e;
      }
    }
  }

  async cleanup() {
    await Promise.all(
      this.createdPublishedTrees.map((treeUuid) =>
        this.removePublished(treeUuid)
      )
    );

    await Promise.all(
      this.createdTrees.map((treeUuid) => this.remove(treeUuid))
    );
  }
}
