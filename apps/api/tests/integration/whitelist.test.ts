import request from "supertest";
import faker from "faker";
import httpStatus from "http-status";
import { app } from "../../src/app";
import { setupTestDB } from "../utils/setupTestDB";
import { userOne, admin, insertUsers } from "../fixtures/user.fixture";
import {
  userOneAccessToken,
  adminAccessToken,
} from "../fixtures/token.fixture";
import prisma from "../../src/init-prisma-client";
import {
  entrySubdomainOne,
  entryOne,
  entryTwo,
  insertEntry,
  entryBaseDomainTwo,
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
          entrySubdomainOne.emailOrDomain,
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
        emails: [
          "fake@example.com",
          "fake@example.com",
          entryOne.emailOrDomain,
        ],
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
      body.emails[1] = "invalidMailcom";

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
      await insertEntry([entryOne, entryTwo, entrySubdomainOne]);

      const res = await request(app)
        .get("/v1/users/whitelist")
        .set("Authorization", `Bearer ${adminAccessToken}`)
        .expect(httpStatus.OK);

      expect(res.body.length).toBe(3);
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
      await insertEntry([entryOne, entryTwo, entrySubdomainOne]);

      const deleteBody = {
        emails: [entryOne.emailOrDomain, entrySubdomainOne.emailOrDomain],
      };

      await request(app)
        .delete("/v1/users/whitelist")
        .set("Authorization", `Bearer ${adminAccessToken}`)
        .send(deleteBody)
        .expect(httpStatus.NO_CONTENT);

      const entriesFromDb = await prisma.whitelistEntry.findMany();
      expect(entriesFromDb.length).toBe(1);
      expect(entriesFromDb[0].emailOrDomain).toBe(entryTwo.emailOrDomain);
    });

    test("should skip non-existing and double mail addresses", async () => {
      await insertUsers([admin]);
      await insertEntry([entryOne, entryTwo]);

      const deleteBodyWithDuplicates = {
        emails: [
          "fake@example.com",
          entryOne.emailOrDomain,
          entryOne.emailOrDomain,
        ],
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
        emails: [entryOne.emailOrDomain],
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
        emails: [entryOne.emailOrDomain],
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
        emails: ["invalidMailcom"],
      };

      await request(app)
        .post("/v1/users/whitelist")
        .set("Authorization", `Bearer ${adminAccessToken}`)
        .send(deleteBody)
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 400 error if domain is invalid", async () => {
      await insertUsers([admin]);
      const deleteBody = {
        emails: ["https://invalidDomain.com"],
      };

      await request(app)
        .post("/v1/users/whitelist")
        .set("Authorization", `Bearer ${adminAccessToken}`)
        .send(deleteBody)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe("POST /v1/users/is-whitelisted", () => {
    test("should return true if an email is whitelisted", async () => {
      await insertUsers([admin]);
      await insertEntry([entryOne]);

      const res = await request(app)
        .post("/v1/users/is-whitelisted")
        .send({ email: entryOne.emailOrDomain })
        .expect(httpStatus.OK);

      expect(res.body.isWhitelisted).toBe(true);
    });

    test("should return true if an email is whitelisted by domain", async () => {
      await insertUsers([admin]);
      await insertEntry([entryBaseDomainTwo]);

      const res = await request(app)
        .post("/v1/users/is-whitelisted")
        .send({ email: "test@open-decision.org" })
        .expect(httpStatus.OK);

      expect(res.body.isWhitelisted).toBe(true);
    });

    test("should return true if an email is whitelisted by subdomain", async () => {
      await insertUsers([admin]);
      await insertEntry([entrySubdomainOne]);

      const res = await request(app)
        .post("/v1/users/is-whitelisted")
        .send({ email: `test@${entrySubdomainOne.emailOrDomain}` })
        .expect(httpStatus.OK);

      expect(res.body.isWhitelisted).toBe(true);
    });

    test("should return true if an email is whitelisted by base domain", async () => {
      await insertUsers([admin]);
      await insertEntry([entryBaseDomainTwo]);

      const res = await request(app)
        .post("/v1/users/is-whitelisted")
        .send({ email: `test@${entrySubdomainOne.emailOrDomain}` })
        .expect(httpStatus.OK);

      expect(res.body.isWhitelisted).toBe(true);
    });

    test("should return false if an only a subdomain is whitelisted", async () => {
      await insertUsers([admin]);
      await insertEntry([entrySubdomainOne]);

      const res = await request(app)
        .post("/v1/users/is-whitelisted")
        .send({ email: `test@open-decision.org` })
        .expect(httpStatus.OK);

      expect(res.body.isWhitelisted).toBe(false);
    });

    test("should return false if an email is not whitelisted ", async () => {
      await insertUsers([admin]);
      await insertEntry([entryOne]);

      const res = await request(app)
        .post("/v1/users/is-whitelisted")
        .send({ email: faker.internet.email().toLowerCase() })
        .expect(httpStatus.OK);

      expect(res.body.isWhitelisted).toBe(false);
    });
  });
});
