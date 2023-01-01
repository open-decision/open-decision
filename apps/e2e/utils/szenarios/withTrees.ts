import { client } from "@open-decision/api-client";
import { User } from "@prisma/client";
import {
  createTreeFixture,
  clearTrees,
  insertTrees,
  PartialTree,
} from "@open-decision/test-utils";
import { APIRequestContext } from "@playwright/test";
import { FetchJSONFunction } from "@open-decision/api-helpers";

export type Trees = {
  activeTree: PartialTree;
  activePublishedTree: PartialTree;
  activeEmptyTree: PartialTree;
  archivedTree: PartialTree;
  archivedPublishedTree: PartialTree;
  archivedEmptyTree: PartialTree;
};

const fetchFn =
  (request: APIRequestContext): FetchJSONFunction =>
  async (url, { body, method }, { validation }) => {
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
  };

export const createTrees = async (request: APIRequestContext, user: User) => {
  const proxiedClient = client({
    fetchFunction: fetchFn(request),
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

  await proxiedClient.trees.publishedTrees.create({
    params: { treeUuid: activePublishedTree.uuid },
    body: { name: "Published Tree" },
  });
  await proxiedClient.trees.publishedTrees.create({
    params: { treeUuid: archivedPublishedTree.uuid },
    body: { name: "Published Tree Two" },
  });

  return {
    activeTree,
    activePublishedTree,
    activeEmptyTree,
    archivedTree,
    archivedPublishedTree,
    archivedEmptyTree,
  };
};
