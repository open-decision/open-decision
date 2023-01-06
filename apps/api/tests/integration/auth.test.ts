import dayjs from "dayjs";
import { clearTestDB } from "../utils/setupTestDB";
import httpStatus from "http-status";
import { app } from "../../src/app";
import request from "supertest";
import { TLoginOutput } from "@open-decision/api-specification";
import { TokenType } from "@prisma/client";
import { tokenHandler } from "../../src/models/token.model";
import UserHandler from "../../src/models/user.model";
import { emailService, tokenService } from "../../src/services";
import config from "../../src/config/config";
import { vi } from "vitest";
import { User } from "@open-decision/test-utils";
import { getAccessToken } from "../utils/generateToken";

describe("POST /v1/auth/login", () => {
  test("should return 200 and login developer with long-runnning access token", async () => {
    const userModel = new User();
    const dev = await userModel.insertDeveloper();

    const loginCredentials = {
      email: dev.email,
      password: dev.password,
    };

    const res = await request(app)
      .post("/v1/auth/login")
      .send(loginCredentials)
      .expect(httpStatus.OK);

    const body = res.body as TLoginOutput;

    // The access token of developer accounts should be valid for roughly one year
    expect(
      dayjs(body.access.token.expires).isAfter(dayjs().add(364, "day"))
    ).toBe(true);
    await userModel.cleanup();
  });

  test("should return 401 error if there are no users with that email", async () => {
    const userModel = new User();
    const user = await userModel.create();
    const loginCredentials = {
      email: user.email,
      password: user.password,
    };

    const res = await request(app)
      .post("/v1/auth/login")
      .send(loginCredentials)
      .expect(httpStatus.UNAUTHORIZED);

    expect(res.body).toHaveProperty("statusCode", httpStatus.UNAUTHORIZED);
    await userModel.cleanup();
  });

  test("should return 401 error if password is wrong", async () => {
    const userModel = new User();
    const user = await userModel.insert();
    const loginCredentials = {
      email: user.email,
      password: "Wrong Password",
    };

    const res = await request(app)
      .post("/v1/auth/login")
      .send(loginCredentials)
      .expect(httpStatus.UNAUTHORIZED);

    expect(res.body).toHaveProperty("statusCode", httpStatus.UNAUTHORIZED);
    await userModel.cleanup();
  });
});

describe("POST /v1/auth/logout", () => {
  test("should remove refreshToken from db on logout", async () => {
    const userModel = new User();
    const user = await userModel.insert();
    const refreshToken = await tokenService.generateRefreshToken(user.uuid);

    await request(app)
      .post("/v1/auth/logout")
      .send({ refreshToken: refreshToken.token })
      .expect(httpStatus.NO_CONTENT);

    const dbRefreshTokenDoc = await tokenHandler.findOne({
      token: refreshToken.token,
      type: TokenType["REFRESH"],
    });

    expect(dbRefreshTokenDoc).toBe(null);
    await userModel.cleanup();
  });
});

describe("POST /v1/auth/register", () => {
  test("should return 201 and successfully register a developer account if email is on developer whitelist", async () => {
    const userModel = new User();
    const newUser = userModel.create();
    config.DEV_ACCOUNT_WHITELIST = [newUser.email];
    const res = await request(app)
      .post("/v1/auth/register")
      .send({ email: newUser.email, password: newUser.password, toc: true })
      .expect(httpStatus.CREATED);

    expect(res.body.user.role).toBe("DEVELOPER");

    // The access token of developer accounts should be valid for roughly one year
    expect(
      dayjs(res.body.access.token.expires).isAfter(dayjs().add(364, "day"))
    ).toBe(true);

    const dbUser = await UserHandler.findByUuidOrId(res.body.user.uuid);
    expect(dbUser).toBeDefined();
    expect(dbUser!.password).not.toBe(newUser.password);
    expect(dbUser).toMatchObject({
      name: null,
      email: newUser.email,
      role: "DEVELOPER",
      emailIsVerified: false,
    });
    await userModel.remove(newUser.uuid);
  });
});

describe("POST /v1/auth/refresh-tokens", () => {
  test("should return 401 error if refresh token is signed using an invalid secret", async () => {
    const userModel = new User();
    const user = await userModel.insert();

    const refreshTokenExpires = dayjs().add(
      config.JWT_REFRESH_EXPIRATION_DAYS,
      "days"
    );

    const refreshToken = await tokenService.generateToken(
      user.uuid,
      refreshTokenExpires,
      TokenType.REFRESH,
      "invalid secret"
    );

    await tokenService.saveToken(
      refreshToken,
      user.uuid,
      refreshTokenExpires,
      TokenType.REFRESH,
      false
    );

    await request(app)
      .post("/v1/auth/refresh-tokens")
      .send({ refreshToken })
      .expect(httpStatus.UNAUTHORIZED);

    await userModel.cleanup();
  });

  test("should return 401 error if refresh token is not found in the database", async () => {
    const userModel = new User();
    const user = await userModel.insert();
    const refreshTokenExpires = dayjs().add(
      config.JWT_REFRESH_EXPIRATION_DAYS,
      "days"
    );
    const refreshToken = await tokenService.generateToken(
      user.uuid,
      refreshTokenExpires,
      TokenType.REFRESH,
      config.REFRESH_TOKEN_SECRET
    );

    await request(app)
      .post("/v1/auth/refresh-tokens")
      .send({ refreshToken })
      .expect(httpStatus.UNAUTHORIZED);

    await userModel.cleanup();
  });

  test("should return 401 error if refresh token as well as the login is expired", async () => {
    const userModel = new User();
    const user = await userModel.insert();
    const refreshTokenExpires = dayjs().subtract(1, "minutes");

    const refreshToken = await tokenService.generateToken(
      user.uuid,
      refreshTokenExpires,
      TokenType.REFRESH,
      config.REFRESH_TOKEN_SECRET
    );

    await tokenService.saveToken(
      refreshToken,
      user.uuid,
      refreshTokenExpires,
      TokenType.REFRESH,
      false
    );

    await request(app)
      .post("/v1/auth/refresh-tokens")
      .send({ refreshToken })
      .expect(httpStatus.UNAUTHORIZED);

    await userModel.cleanup();
  });
});

describe("POST /v1/auth/forgot-password", () => {
  if (!emailService) throw new Error("Email service is not available");

  beforeEach(() => {
    // @ts-ignore
    vi.spyOn(emailService, "sendResetPasswordEmail").mockResolvedValue();
  });

  test("should return 204 and send reset password email to the user", async () => {
    const userModel = new User();
    const user = await userModel.insert();

    const sendResetPasswordEmailSpy = vi.spyOn(
      emailService,
      // @ts-ignore
      "sendResetPasswordEmail"
    );

    await request(app)
      .post("/v1/auth/forgot-password")
      .send({ email: user.email })
      .expect(httpStatus.NO_CONTENT);

    expect(sendResetPasswordEmailSpy).toHaveBeenCalledWith(
      user.email,
      expect.any(String)
    );

    // @ts-ignore
    const resetPasswordToken = sendResetPasswordEmailSpy.mock.calls[0][1];
    // @ts-ignore

    const dbResetPasswordTokenDoc = await tokenHandler.findOne({
      // @ts-ignore
      token: resetPasswordToken,
      type: TokenType.RESET_PASSWORD,
    });

    expect(dbResetPasswordTokenDoc).toBeDefined();
    await userModel.cleanup();
  });

  test("should return 400 if email is missing", async () => {
    await request(app)
      .post("/v1/auth/forgot-password")
      .send()
      .expect(httpStatus.BAD_REQUEST);
  });

  test("should return 404 if email does not belong to any user", async () => {
    const userModel = new User();
    const user = userModel.create();
    await request(app)
      .post("/v1/auth/forgot-password")
      .send({ email: user.email })
      .expect(httpStatus.NOT_FOUND);
  });
});
describe("POST /v1/auth/reset-password", () => {
  test("should return 400 if reset password token is missing", async () => {
    await request(app)
      .post("/v1/auth/reset-password")
      .send({ password: "434rmo4fm4rmkds" })
      .expect(httpStatus.BAD_REQUEST);
  });

  test("should return 401 if reset password token is expired", async () => {
    const userModel = new User();
    const user = await userModel.insert();

    const expires = dayjs().subtract(1, "minutes");
    const resetPasswordToken = await tokenService.generateToken(
      user.uuid,
      expires,
      TokenType.RESET_PASSWORD,
      config.ACCESS_TOKEN_SECRET
    );

    await tokenService.saveToken(
      resetPasswordToken,
      user.uuid,
      expires,
      TokenType.RESET_PASSWORD
    );

    await request(app)
      .post("/v1/auth/reset-password")
      .send({ password: "434rmo4fm4rmkds", token: resetPasswordToken })
      .expect(httpStatus.UNAUTHORIZED);

    await userModel.cleanup();
  });

  test("should return 401 if user is not found", async () => {
    const userModel = new User();
    const user = await userModel.insert();

    const resetPasswordToken = await tokenService.generateResetPasswordToken(
      user.email
    );
    await UserHandler.remove(user.uuid);

    await request(app)
      .post("/v1/auth/reset-password")
      .send({ password: "434rmo4fm4rmkds", token: resetPasswordToken })
      .expect(httpStatus.UNAUTHORIZED);
  });
});

describe("POST /v1/auth/send-verification-email", () => {
  if (!emailService) throw new Error("Email service is not available");

  beforeEach(() => {
    // @ts-ignore
    vi.spyOn(emailService, "sendVerificationEmail").mockResolvedValue();
  });
  test("should return 204 and send verification email to the user", async () => {
    const userModel = new User();
    const user = await userModel.insert();

    const sendVerificationEmailSpy = vi.spyOn(
      emailService,
      // @ts-ignore
      "sendVerificationEmail"
    );

    await request(app)
      .post("/v1/auth/send-verification-email")
      .set("Authorization", `Bearer ${await getAccessToken(user.uuid)}`)
      .expect(httpStatus.NO_CONTENT);

    expect(sendVerificationEmailSpy).toHaveBeenCalledWith(
      user.email,
      expect.any(String)
    );
    // @ts-ignore
    const verifyEmailToken = sendVerificationEmailSpy.mock.calls[0][1];
    const dbVerifyEmailToken = await tokenHandler.findOne({
      // @ts-ignore
      token: verifyEmailToken,
      type: TokenType.VERIFY_EMAIL,
    });

    expect(dbVerifyEmailToken).toBeDefined();
    await userModel.cleanup();
  });

  test("should return 401 error if access token is missing", async () => {
    await request(app)
      .post("/v1/auth/send-verification-email")
      .send()
      .expect(httpStatus.UNAUTHORIZED);
  });
});

describe("POST /v1/auth/verify-email", () => {
  test("should return 204 and verify the email", async () => {
    const userModel = new User();
    const user = await userModel.insert();

    const verifyEmailToken = await tokenService.generateVerifyEmailToken(
      user.uuid
    );

    await request(app)
      .post("/v1/auth/verify-email")
      .send({ token: verifyEmailToken })
      .expect(httpStatus.NO_CONTENT);

    const dbUser = await UserHandler.findByUuidOrId(user.uuid);

    expect(dbUser!.emailIsVerified).toBe(true);

    const dbVerifyEmailToken = await tokenHandler.findOne({
      token: verifyEmailToken,
      type: TokenType.VERIFY_EMAIL,
    });
    expect(dbVerifyEmailToken).toBe(null);
    await userModel.cleanup();
  });

  test("should return 400 if verify email token is missing", async () => {
    await request(app)
      .post("/v1/auth/verify-email")
      .send()
      .expect(httpStatus.BAD_REQUEST);
  });

  test("should return 401 if verify email token is expired", async () => {
    const userModel = new User();
    const user = await userModel.insert();

    const expires = dayjs().subtract(1, "minutes");
    const verifyEmailToken = await tokenService.generateToken(
      user.uuid,
      expires,
      TokenType.VERIFY_EMAIL,
      config.ACCESS_TOKEN_SECRET
    );
    await tokenService.saveToken(
      verifyEmailToken,
      user.uuid,
      expires,
      TokenType.VERIFY_EMAIL
    );

    await request(app)
      .post("/v1/auth/verify-email")
      .send({ token: verifyEmailToken })
      .expect(httpStatus.UNAUTHORIZED);

    await userModel.cleanup();
  });
});
