import { vi } from "vitest";
import dayjs from "dayjs";
import httpStatus from "http-status";
import httpMocks from "node-mocks-http";
import config from "../../../src/config/config";
import { auth } from "../../../src/middlewares/auth";
import { tokenService } from "../../../src/services";
import { APIError } from "@open-decision/type-classes";
import { adminRights } from "../../../src/config/roles";
import { User } from "@open-decision/test-utils";
import { getAccessToken } from "../../utils/generateToken";
import { TokenType } from "@prisma/client";

const unauthorizedError = {
  code: "UNAUTHORIZED",
  isOperational: true,
  name: "ODError",
  statusCode: httpStatus.UNAUTHORIZED,
};
describe("Auth middleware", () => {
  test("should call next with no errors if access token is valid", async () => {
    const userModel = new User();
    const user = await userModel.insert();

    const req = httpMocks.createRequest({
      headers: { Authorization: `Bearer ${await getAccessToken(user.uuid)}` },
    });
    const next = vi.fn();

    await auth()(req, httpMocks.createResponse(), next);
    expect(next).toHaveBeenCalledWith();
    expect(req.user.uuid).toEqual(user.uuid);
    await userModel.cleanup();
  });

  test("should call next with unauthorized error if access token is not found in header", async () => {
    const req = httpMocks.createRequest();
    const next = vi.fn();

    await auth()(req, httpMocks.createResponse(), next);
    console.log(JSON.stringify(next.mock.calls[0]));

    expect(next).toHaveBeenCalledWith(expect.any(APIError));
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining(unauthorizedError)
    );
  });

  test("should call next with unauthorized error if access token is not a valid jwt token", async () => {
    const req = httpMocks.createRequest({
      headers: { Authorization: "Bearer randomToken" },
    });
    const next = vi.fn();

    await auth()(req, httpMocks.createResponse(), next);

    expect(next).toHaveBeenCalledWith(
      //INFO: this is not the right error as the validation middleware will already throw with an validation error
      expect.objectContaining(unauthorizedError)
    );
  });

  test("should call next with unauthorized error if the token is not an access token", async () => {
    const userModel = new User();
    const user = await userModel.insert();
    const refreshToken = await tokenService.generateRefreshToken(user.uuid);
    const req = httpMocks.createRequest({
      headers: { Authorization: `Bearer ${refreshToken}` },
    });
    const next = vi.fn();

    await auth()(req, httpMocks.createResponse(), next);

    expect(next).toHaveBeenCalledWith(expect.any(APIError));
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining(unauthorizedError)
    );
    await userModel.cleanup();
  });

  test("should call next with unauthorized error if access token is generated with an invalid secret", async () => {
    const userModel = new User();
    const user = await userModel.insert();
    const expires = dayjs().add(
      config.JWT_ACCESS_EXPIRATION_MINUTES,
      "minutes"
    );
    const accessToken = tokenService.generateToken(
      user.uuid,
      expires,
      TokenType.ACCESS,
      "invalidSecret"
    );
    const req = httpMocks.createRequest({
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const next = vi.fn();

    await auth()(req, httpMocks.createResponse(), next);

    expect(next).toHaveBeenCalledWith(expect.any(APIError));
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining(unauthorizedError)
    );
    await userModel.cleanup();
  });

  test("should call next with unauthorized error if access token is expired", async () => {
    const userModel = new User();
    const user = await userModel.insert();
    const expires = dayjs().subtract(1, "minutes");
    const accessToken = tokenService.generateToken(
      user.uuid,
      expires,
      TokenType.ACCESS,
      config.ACCESS_TOKEN_SECRET
    );
    const req = httpMocks.createRequest({
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const next = vi.fn();

    await auth()(req, httpMocks.createResponse(), next);

    expect(next).toHaveBeenCalledWith(expect.any(APIError));
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining(unauthorizedError)
    );
    await userModel.cleanup();
  });

  test("should call next without error if JWT is valid even though user doesn't exist in DB", async () => {
    const userModel = new User();
    const user = await userModel.create();
    const req = httpMocks.createRequest({
      headers: { Authorization: `Bearer ${await getAccessToken(user.uuid)}` },
    });
    const next = vi.fn();

    await auth()(req, httpMocks.createResponse(), next);

    expect(next).toHaveBeenCalledWith();
    await userModel.cleanup();
  });

  test("should call next with forbidden error if user does not have required rights", async () => {
    const userModel = new User();
    const user = await userModel.insert();
    const req = httpMocks.createRequest({
      headers: { Authorization: `Bearer ${await getAccessToken(user.uuid)}` },
    });
    const next = vi.fn();

    await auth("manageUsers")(req, httpMocks.createResponse(), next);

    console.log(next.mock.lastCall);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        code: "FORBIDDEN",
        isOperational: true,
        statusCode: 403,
      })
    );
    await userModel.cleanup();
  });

  test("should call next with no errors if user has required rights", async () => {
    const userModel = new User();
    const admin = await userModel.insertAdmin();
    const req = httpMocks.createRequest({
      headers: { Authorization: `Bearer ${await getAccessToken(admin.uuid)}` },
    });
    const next = vi.fn();

    await auth(...adminRights)(req, httpMocks.createResponse(), next);

    expect(next).toHaveBeenCalledWith();
  });
});
