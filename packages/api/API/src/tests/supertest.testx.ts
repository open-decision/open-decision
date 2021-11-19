//Currently not working, therefore named *.testx.* to prevent execution.

import { doesNotMatch } from "assert";
import request from "supertest";
import { app, server } from "../index";
import { prismaMock as prisma } from "../singleton";

afterAll((done) => {
  server.close();
  done();
});

const user = {
  email: "userk@a.com",
  password: "asdsadadsdasd",
};
jest.setTimeout(10000);
describe("Test auth", () => {
  it("add a user", async (done) => {
    const response = await request(app)
      .post("/auth/signup")
      .send(user)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body.accessToken).toBeDefined();
  });
});
