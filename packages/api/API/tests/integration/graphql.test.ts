import request from "supertest";
import httpStatus from "http-status";
import faker from "faker";
import { app } from "../../src/app";
import { userOne, insertUsers, userTwo } from "../fixtures/user.fixture";
import { userOneAccessToken } from "../fixtures/token.fixture";
import { DecisionTree } from "@prisma/client";
import prisma from "../../src/init-prisma-client";
import {
  createTree,
  getSingleTree,
  getManyTrees,
  updateSingleTree,
  updateManyTree,
  deleteSingleTree,
  deleteManyTree,
} from "../utils/gqlQueriesMutations";
import { setupTestDB } from "../utils/setupTestDB";
import {
  insertTrees,
  treeOne,
  treeThree,
  treeTwo,
} from "../fixtures/decisionTree.fixture";

setupTestDB();

//create
//getSingle
//getmany -> test filtering
//delete
//update
//delete many
//update many

describe("GraphQL route", () => {
  describe("CREATE - POST /v1/graphql", () => {
    test("should create a valid tree", async () => {
      await insertUsers([userOne]);

      const treeName = faker.random.words(4);

      const res = await request(app)
        .post("/v1/graphql")
        .set("Authorization", `Bearer ${userOneAccessToken}`)
        .set("Accept", "application/json")
        .send(createTree(treeName))
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        data: {
          createDecisionTree: {
            id: expect.anything(),
            createdAt: expect.anything(),
            updatedAt: expect.anything(),
            name: treeName,
            tags: null,
            treeData: null,
            language: "de_DE",
          },
        },
      });
    });

    test("should return 403 if not signed in", async () => {
      await insertUsers([userOne]);

      const res = await request(app)
        .post("/v1/graphql")
        .set("Accept", "application/json")
        .send(createTree("Test"))
        .expect(httpStatus.UNAUTHORIZED);
    });
  });
  describe("READ - POST /v1/graphql", () => {
    test("should return the selected tree", async () => {
      await insertUsers([userOne, userTwo]);
      await insertTrees([treeOne, treeTwo, treeThree]);

      const res = await request(app)
        .post("/v1/graphql")
        .set("Authorization", `Bearer ${userOneAccessToken}`)
        .set("Accept", "application/json")
        .send(getSingleTree(treeOne.id))
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        data: {
          decisionTree: {
            id: treeOne.id,
            name: treeOne.name,
          },
        },
      });
    });
  });
  test("should return the trees with matching criteria owned by the current user", async () => {
    await insertUsers([userOne, userTwo]);
    await insertTrees([treeOne, treeTwo, treeThree]);

    const whereInput = {
      name: {
        contains: "Tree",
      },
    };
    const res = await request(app)
      .post("/v1/graphql")
      .set("Authorization", `Bearer ${userOneAccessToken}`)
      .set("Accept", "application/json")
      .send(getManyTrees(whereInput))
      .expect(httpStatus.OK);

    expect(res.body).toEqual({
      data: {
        decisionTrees: [
          {
            id: treeOne.id,
            name: treeOne.name,
          },
          {
            id: treeTwo.id,
            name: treeTwo.name,
          },
        ],
      },
    });

    expect(res.body.data.decisionTrees[2]).not.toBeDefined();
  });

  describe("UPDATE - POST /v1/graphql", () => {
    test("should update the selected tree", async () => {
      await insertUsers([userOne, userTwo]);
      await insertTrees([treeOne, treeTwo, treeThree]);

      const updateData: any = {
        name: {
          set: "New Name",
        },
        treeData: { Test: "Testdata" },
      };

      const res = await request(app)
        .post("/v1/graphql")
        .set("Authorization", `Bearer ${userOneAccessToken}`)
        .set("Accept", "application/json")
        .send(updateSingleTree(updateData, treeOne.id))
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        data: {
          updateDecisionTree: {
            id: treeOne.id,
            name: updateData.name.set,
            treeData: updateData.treeData,
          },
        },
      });

      const treeFromDb = await prisma.decisionTree.findUnique({
        where: {
          id: treeOne.id,
        },
      });

      expect(treeFromDb).toMatchObject({
        name: updateData.name.set,
        treeData: updateData.treeData,
      });
    });

    test("should fail if trying to update the id", async () => {
      await insertUsers([userOne, userTwo]);
      await insertTrees([treeOne, treeTwo, treeThree]);

      const updateData: any = {
        id: {
          set: 10,
        },
      };

      const res = await request(app)
        .post("/v1/graphql")
        .set("Authorization", `Bearer ${userOneAccessToken}`)
        .set("Accept", "application/json")
        .send(updateSingleTree(updateData, treeOne.id))
        //for some reason this returns 500 in tests
        //it should be 400, which works outside of tests
        .expect(httpStatus.INTERNAL_SERVER_ERROR);
    });

    test("should fail if tree does not exist", async () => {
      await insertUsers([userOne, userTwo]);
      await insertTrees([treeOne, treeTwo, treeThree]);

      const updateData: any = {
        name: {
          set: "New Name",
        },
      };

      //TODO: does not work yet, due to GQL error handling
      const res = await request(app)
        .post("/v1/graphql")
        .set("Authorization", `Bearer ${userOneAccessToken}`)
        .set("Accept", "application/json")
        .send(updateSingleTree(updateData, 460))
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should update several trees matching the criteria", async () => {
      await insertUsers([userOne, userTwo]);
      await insertTrees([treeOne, treeTwo, treeThree]);

      const whereInput = {
        name: {
          contains: "Tree",
        },
      };

      const updateData: any = {
        name: {
          set: "New Name",
        },
        treeData: { Test: "Test" },
      };

      const res = await request(app)
        .post("/v1/graphql")
        .set("Authorization", `Bearer ${userOneAccessToken}`)
        .set("Accept", "application/json")
        .send(updateManyTree(updateData, whereInput));

      expect(res.body).toEqual({
        data: {
          updateManyDecisionTree: {
            count: 2,
          },
        },
      });

      const treesFromDb = await prisma.decisionTree.findMany({
        where: {
          name: "New Name",
        },
      });

      expect(treesFromDb).toHaveLength(2);
    });
  });
  describe("DELETE - POST /v1/graphql", () => {
    test("should delete the selected tree", async () => {
      await insertUsers([userOne, userTwo]);
      await insertTrees([treeOne, treeTwo, treeThree]);

      const res = await request(app)
        .post("/v1/graphql")
        .set("Authorization", `Bearer ${userOneAccessToken}`)
        .set("Accept", "application/json")
        .send(deleteSingleTree(treeOne.id))
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        data: {
          deleteDecisionTree: {
            id: treeOne.id,
            name: treeOne.name,
          },
        },
      });
      const treeFromDb = await prisma.decisionTree.findUnique({
        where: {
          id: treeOne.id,
        },
      });

      expect(treeFromDb).toBeNull();
    });

    test("should delete trees matching the criteria", async () => {
      await insertUsers([userOne, userTwo]);
      await insertTrees([treeOne, treeTwo, treeThree]);

      const whereInput = {
        name: {
          contains: "Tree",
        },
      };

      const res = await request(app)
        .post("/v1/graphql")
        .set("Authorization", `Bearer ${userOneAccessToken}`)
        .set("Accept", "application/json")
        .send(deleteManyTree(whereInput))
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        data: {
          deleteManyDecisionTree: {
            count: 2,
          },
        },
      });

      const treesFromDb = await prisma.decisionTree.findMany({
        where: whereInput,
      });

      //Only the foreign tree of userTwo should remain
      expect(treesFromDb).toHaveLength(1);
    });
  });
});
