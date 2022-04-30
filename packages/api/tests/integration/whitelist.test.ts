import request from "supertest";
import faker from "faker";
import httpStatus from "http-status";
import { app } from "../../src/app";
import { setupTestDB } from "../utils/setupTestDB";
import { userOne, userTwo, admin, insertUsers } from "../fixtures/user.fixture";
import {
  userOneAccessToken,
  adminAccessToken,
} from "../fixtures/token.fixture";
import prisma from "../../src/init-prisma-client";
import {
  entryOne,
  entryTwo,
  insertEntry,
} from "../fixtures/whitelistEntry.fixture";
setupTestDB();

describe("Whitelist user routes", () => {
  describe("POST /v1/users/whitelist", () => {
    let body: Record<string, any>;

    beforeEach(() => {
      body = {
        emails: [
          faker.internet.email().toLowerCase(),
          faker.internet.email().toLowerCase(),
          faker.internet.email().toLowerCase(),
        ],
        sendInvite: true,
      };
    });

    test("should return 204 if everything is fine", async () => {
      await insertUsers([admin]);

      await request(app)
        .post("/v1/users/whitelist")
        .set("Authorization", `Bearer ${adminAccessToken}`)
        .send(body)
        .expect(httpStatus.NO_CONTENT);

      const entriesFromDb = await prisma.whitelistEntry.findMany();
      expect(entriesFromDb.length).toBe(3);
      expect(entriesFromDb[0].creatorUuid).toBe(admin.uuid);
      expect(entriesFromDb[0].sendInvite).toBe(true);
    });

    test("should skip existing and double mail addresses", async () => {
      await insertUsers([admin]);
      await insertEntry([entryOne]);

      const bodyWithDuplicates = {
        emails: ["fake@example.com", "fake@example.com", entryOne.email],
      };

      await request(app)
        .post("/v1/users/whitelist")
        .set("Authorization", `Bearer ${adminAccessToken}`)
        .send(bodyWithDuplicates)
        .expect(httpStatus.NO_CONTENT);

      const entriesFromDb = await prisma.whitelistEntry.findMany();
      expect(entriesFromDb.length).toBe(2);
    });

    test("should return 401 error if access token is missing", async () => {
      await request(app)
        .post("/v1/users/whitelist")
        .send(body)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test("should return 403 error if logged in user is not admin", async () => {
      await insertUsers([userOne]);

      await request(app)
        .post("/v1/users/whitelist")
        .set("Authorization", `Bearer ${userOneAccessToken}`)
        .send(body)
        .expect(httpStatus.FORBIDDEN);
    });

    test("should return 400 error if email is invalid", async () => {
      await insertUsers([admin]);
      body.emails[1] = "invalidMail.com";

      await request(app)
        .post("/v1/users/whitelist")
        .set("Authorization", `Bearer ${adminAccessToken}`)
        .send(body)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe("GET /v1/users/whitelist", () => {
    test("should return all whitelist entries", async () => {
      await insertUsers([admin]);
      await insertEntry([entryOne, entryTwo]);

      const res = await request(app)
        .get("/v1/users/whitelist")
        .set("Authorization", `Bearer ${adminAccessToken}`)
        .expect(httpStatus.OK);

      expect(res.body.length).toBe(2);
    });

    test("should return 401 error if access token is missing", async () => {
      await request(app)
        .get("/v1/users/whitelist")
        .expect(httpStatus.UNAUTHORIZED);
    });

    test("should return 403 error if logged in user is not admin", async () => {
      await insertUsers([userOne]);

      await request(app)
        .get("/v1/users/whitelist")
        .set("Authorization", `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.FORBIDDEN);
    });
  });

  describe("DELETE /v1/users/whitelist", () => {
    test("should return 204 if deletion is successful", async () => {
      await insertUsers([admin]);
      await insertEntry([entryOne, entryTwo]);

      const deleteBody = {
        emails: [entryOne.email],
      };

      await request(app)
        .delete("/v1/users/whitelist")
        .set("Authorization", `Bearer ${adminAccessToken}`)
        .send(deleteBody)
        .expect(httpStatus.NO_CONTENT);

      const entriesFromDb = await prisma.whitelistEntry.findMany();
      expect(entriesFromDb.length).toBe(1);
      expect(entriesFromDb[0].email).toBe(entryTwo.email);
    });

    test("should skip non-existing and double mail addresses", async () => {
      await insertUsers([admin]);
      await insertEntry([entryOne, entryTwo]);

      const deleteBodyWithDuplicates = {
        emails: ["fake@example.com", entryOne.email, entryOne.email],
      };

      await request(app)
        .delete("/v1/users/whitelist")
        .set("Authorization", `Bearer ${adminAccessToken}`)
        .send(deleteBodyWithDuplicates)
        .expect(httpStatus.NO_CONTENT);

      const entriesFromDb = await prisma.whitelistEntry.findMany();
      expect(entriesFromDb.length).toBe(1);
    });

    test("should return 401 error if access token is missing", async () => {
      await insertUsers([admin]);
      await insertEntry([entryOne, entryTwo]);
      const deleteBody = {
        emails: [entryOne.email],
      };
      await request(app)
        .delete("/v1/users/whitelist")
        .send(deleteBody)
        .expect(httpStatus.UNAUTHORIZED);
    });

    test("should return 403 error if logged in user is not admin", async () => {
      await insertUsers([admin, userOne]);
      await insertEntry([entryOne, entryTwo]);
      const deleteBody = {
        emails: [entryOne.email],
      };
      await request(app)
        .post("/v1/users/whitelist")
        .set("Authorization", `Bearer ${userOneAccessToken}`)
        .send(deleteBody)
        .expect(httpStatus.FORBIDDEN);
    });

    test("should return 400 error if email is invalid", async () => {
      await insertUsers([admin]);
      const deleteBody = {
        emails: ["invalidMail.com"],
      };

      await request(app)
        .post("/v1/users/whitelist")
        .set("Authorization", `Bearer ${adminAccessToken}`)
        .send(deleteBody)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
