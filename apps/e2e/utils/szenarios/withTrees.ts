import { client } from "@open-decision/api-client";
import { User } from "@open-decision/prisma";
import {
  createTreeFixture,
  clearTrees,
  insertTrees,
  getFromEnv,
  PartialTree,
} from "@open-decision/test-utils";
import test from "@playwright/test";

export type WithTrees = {
  activeTree: PartialTree;
  activePublishedTree: PartialTree;
  activeEmptyTree: PartialTree;
  archivedTree: PartialTree;
  archivedPublishedTree: PartialTree;
  archivedEmptyTree: PartialTree;
};

export const withTrees = () => {
  test.beforeEach(async ({ request }) => {
    const user = getFromEnv<User>("user");

    const proxiedOD = client({
      fetchFunction: async (url, { body, method }, { validation }) => {
        const response = await request.fetch(url, { data: body, method });
        let data;
        const contentType = response.headers()["content-type"];
        if (
          contentType?.includes("application/json") &&
          response.status() !== 204
        ) {
          data = await response.json();
        }

        const parsedData = validation?.parse(data) ?? data;

        return { data: parsedData, status: response.status() };
      },
      urlPrefix: "/api/external-api",
    });

    const activeTree = createTreeFixture({
      name: "This is an active tree",
      createdAt: new Date("2020-01-01T00:00:00.000Z"),
      updatedAt: new Date("2022-01-01T00:00:00.000Z"),
      status: "ACTIVE",
    });
    const activePublishedTree = createTreeFixture({
      name: "This is an active and published tree",
      createdAt: new Date("2020-01-01T00:00:00.000Z"),
      updatedAt: new Date("2022-01-01T00:00:00.000Z"),
      status: "ACTIVE",
    });
    const activeEmptyTree = createTreeFixture({
      name: "This is an active and empty tree",
      yDocument: "",
      createdAt: new Date("2021-01-01T00:00:00.000Z"),
      updatedAt: new Date("2020-01-01T00:00:00.000Z"),
      status: "ACTIVE",
    });
    const archivedTree = createTreeFixture({
      name: "This is an archived tree",
      createdAt: new Date("2020-01-01T00:00:00.000Z"),
      updatedAt: new Date("2022-01-01T00:00:00.000Z"),
      status: "ARCHIVED",
    });
    const archivedPublishedTree = createTreeFixture({
      name: "This is an archived and published tree",
      createdAt: new Date("2020-01-01T00:00:00.000Z"),
      updatedAt: new Date("2022-01-01T00:00:00.000Z"),
      status: "ARCHIVED",
    });
    const archivedEmptyTree = createTreeFixture({
      name: "This is an archived and empty tree",
      yDocument: "",
      createdAt: new Date("2021-01-01T00:00:00.000Z"),
      updatedAt: new Date("2020-01-01T00:00:00.000Z"),
      status: "ARCHIVED",
    });

    await clearTrees(user.uuid, [
      insertTrees(user.uuid, [
        activeTree,
        activePublishedTree,
        activeEmptyTree,
        archivedTree,
        archivedEmptyTree,
        archivedPublishedTree,
      ]),
    ]);

    await proxiedOD.trees.publishedTrees.create({
      params: { treeUuid: activePublishedTree.uuid },
      body: { name: "Published Tree" },
    });
    await proxiedOD.trees.publishedTrees.create({
      params: { treeUuid: archivedPublishedTree.uuid },
      body: { name: "Published Tree Two" },
    });

    const envTrees = {
      activeTree,
      activePublishedTree,
      activeEmptyTree,
      archivedTree,
      archivedPublishedTree,
      archivedEmptyTree,
    };

    let key: keyof typeof envTrees;
    for (key in envTrees) {
      envTrees[key].yDocument = null;
    }

    process.env["trees"] = JSON.stringify({
      activeTree,
      activePublishedTree,
      activeEmptyTree,
      archivedTree,
      archivedPublishedTree,
      archivedEmptyTree,
    });
  });
};
