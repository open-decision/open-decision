import request from "supertest";
import faker from "faker";
import dayjs from "dayjs";
import httpStatus from "http-status";
import httpMocks from "node-mocks-http";
import { app } from "../../src/app";
import config from "../../src/config/config";
import { auth } from "../../src/middlewares/auth";
import { emailService, tokenService } from "../../src/services";
import ApiError from "../../src/utils/ApiError";
import { setupTestDB } from "../utils/setupTestDB";
// import { User } from "../../src/models/user.model";
// import { Token } from "../../src/models/token.model";
import { adminRights } from "../../src/config/roles";
import {
  userOne,
  userTwo,
  admin,
  insertUsers,
  developer,
} from "../fixtures/user.fixture";
import {
  userOneAccessToken,
  adminAccessToken,
} from "../fixtures/token.fixture";
import UserHandler from "../../src/models/user.model";
import { tokenHandler } from "../../src/models/token.model";
import { TokenType } from "@open-decision/models/prisma-client";
import {
  hasNoRefreshCookie,
  hasRefreshCookie,
} from "../utils/refreshCookieHelpers";
import {
  entryOne,
  insertEntry,
  entrySubdomainOne,
  entryBaseDomainTwo,
} from "../fixtures/whitelistEntry.fixture";
import { emailIsWhitelisted } from "../../src/models/whitelistEntry.model";

setupTestDB();

describe("Auth routes", () => {
  describe("POST /v1/auth/register", () => {
    let newUser: Record<string, string>;
    beforeEach(() => {
      newUser = {
        email: faker.internet.email().toLowerCase(),
        password: "Th@t!shardToGuess",
      };
    });

    test("should return 201 and successfully register user if request data is ok", async () => {
      const res = await request(app)
        .post("/v1/auth/register")
        .send(newUser)
        .expect(httpStatus.CREATED)
        .expect(hasRefreshCookie);

      expect(res.body.user).toEqual({
        uuid: expect.anything(),
        name: null,
        email: newUser.email,
        role: "USER",
        emailIsVerified: false,
      });

      expect(res.body.access).toEqual({
        token: expect.anything(),
        expires: expect.anything(),
      });

      const dbUser = await UserHandler.findByUuidOrId(res.body.user.uuid);
      expect(dbUser).toBeDefined();
      expect(dbUser!.password).not.toBe(newUser.password);
      expect(dbUser).toMatchObject({
        name: null,
        email: newUser.email,
        role: "USER",
        emailIsVerified: false,
      });

      expect(res.body).not.toHaveProperty("refresh");
    });

    test("should return 201 and successfully register a developer account if email is on developer whitelist", async () => {
      config.DEV_ACCOUNT_WHITELIST = [newUser.email];
      const res = await request(app)
        .post("/v1/auth/register")
        .send(newUser)
        .expect(httpStatus.CREATED)
        .expect(hasRefreshCookie);

      expect(res.body.user).toEqual({
        uuid: expect.anything(),
        name: null,
        email: newUser.email,
        role: "DEVELOPER",
        emailIsVerified: false,
      });

      expect(res.body.access).toEqual({
        token: expect.anything(),
        expires: expect.anything(),
      });

      // The access token of developer accounts should be valid for roughly one year
      expect(
        dayjs(res.body.access.expires).isAfter(dayjs().add(364, "day"))
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

      expect(res.body).not.toHaveProperty("refresh");
    });

    test("should return 201 and successfully register an admin account if email is on admin whitelist", async () => {
      config.ADMIN_ACCOUNT_WHITELIST = [newUser.email];
      const res = await request(app)
        .post("/v1/auth/register")
        .send(newUser)
        .expect(httpStatus.CREATED)
        .expect(hasRefreshCookie);

      expect(res.body.user).toEqual({
        uuid: expect.anything(),
        name: null,
        email: newUser.email,
        role: "ADMIN",
        emailIsVerified: false,
      });

      expect(res.body.access).toEqual({
        token: expect.anything(),
        expires: expect.anything(),
      });

      const dbUser = await UserHandler.findByUuidOrId(res.body.user.uuid);
      expect(dbUser).toBeDefined();
      expect(dbUser!.password).not.toBe(newUser.password);
      expect(dbUser).toMatchObject({
        name: null,
        email: newUser.email,
        role: "ADMIN",
        emailIsVerified: false,
      });

      expect(res.body).not.toHaveProperty("refresh");
    });

    test("should return 201 and successfully register user if whitelist is activated and email is indivudally whitelisted", async () => {
      config.RESTRICT_REGISTRATION_TO_WHITELISTED_ACCOUNTS = true;
      await insertUsers([admin]);
      await insertEntry([{ ...entryOne, emailOrDomain: newUser.email }]);

      const res = await request(app)
        .post("/v1/auth/register")
        .send(newUser)
        .expect(httpStatus.CREATED)
        .expect(hasNoRefreshCookie);

      expect(res.body.access).toBeUndefined();

      // The whitelist entry should be deleted after the successful registration
      expect(await (await emailIsWhitelisted(newUser.email)).result).toBe(
        false
      );

      config.RESTRICT_REGISTRATION_TO_WHITELISTED_ACCOUNTS = false;
    });

    test("should return 201 and successfully register user if whitelist is activated and email is domain whitelisted", async () => {
      config.RESTRICT_REGISTRATION_TO_WHITELISTED_ACCOUNTS = true;
      await insertUsers([admin]);
      await insertEntry([entryBaseDomainTwo]);

      const res = await request(app)
        .post("/v1/auth/register")
        .send({ email: userTwo.email, password: userTwo.password })
        .expect(httpStatus.CREATED)
        .expect(hasNoRefreshCookie);

      expect(res.body.access).toBeUndefined();

      config.RESTRICT_REGISTRATION_TO_WHITELISTED_ACCOUNTS = false;
    });

    test("should return 201 and successfully register user if whitelist is activated and email is whitelisted by base domain", async () => {
      config.RESTRICT_REGISTRATION_TO_WHITELISTED_ACCOUNTS = true;
      await insertUsers([admin]);
      await insertEntry([entryBaseDomainTwo]);

      const res = await request(app)
        .post("/v1/auth/register")
        .send({ email: userTwo.email, password: userTwo.password })
        .expect(httpStatus.CREATED)
        .expect(hasNoRefreshCookie);

      expect(res.body.access).toBeUndefined();
      config.RESTRICT_REGISTRATION_TO_WHITELISTED_ACCOUNTS = false;
    });

    test("should return 400 if whitelist is activated and email is not whitelisted", async () => {
      config.RESTRICT_REGISTRATION_TO_WHITELISTED_ACCOUNTS = true;
      await insertUsers([admin]);
      await insertEntry([entryOne]);

      await request(app)
        .post("/v1/auth/register")
        .send(newUser)
        .expect(httpStatus.FORBIDDEN);

      config.RESTRICT_REGISTRATION_TO_WHITELISTED_ACCOUNTS = false;
    });

    test("should return 400 if whitelist is activated and email is not on the right subdomain", async () => {
      config.RESTRICT_REGISTRATION_TO_WHITELISTED_ACCOUNTS = true;
      await insertUsers([admin]);
      await insertEntry([entrySubdomainOne]);

      await request(app)
        .post("/v1/auth/register")
        .send({
          email: "test@wrongsubdomain.open-decision.org",
          password: newUser.password,
        })
        .expect(httpStatus.FORBIDDEN);

      config.RESTRICT_REGISTRATION_TO_WHITELISTED_ACCOUNTS = false;
    });

    test("should return 400 if whitelist is activated, subdomain is whitelisted but  email is on basedomain", async () => {
      config.RESTRICT_REGISTRATION_TO_WHITELISTED_ACCOUNTS = true;
      await insertUsers([admin]);
      await insertEntry([entrySubdomainOne]);

      await request(app)
        .post("/v1/auth/register")
        .send({
          email: "test@open-decision.org",
          password: newUser.password,
        })
        .expect(httpStatus.FORBIDDEN);

      config.RESTRICT_REGISTRATION_TO_WHITELISTED_ACCOUNTS = false;
    });

    test("should not delete whitelist entry if account creation fails", async () => {
      // This is not a realistic use-case, why would you whitelist an existing account
      // However, this is the easiest way to ensure that the account creation fails to
      // test if the whitelist entry is not deleted

      config.RESTRICT_REGISTRATION_TO_WHITELISTED_ACCOUNTS = true;
      await insertUsers([userOne, admin]);
      await insertEntry([{ ...entryOne, emailOrDomain: userOne.email }]);

      await request(app)
        .post("/v1/auth/register")
        .send({ email: userOne.email, password: userOne.password })
        .expect(httpStatus.BAD_REQUEST);

      expect(await (await emailIsWhitelisted(userOne.email)).result).toBe(true);
      config.RESTRICT_REGISTRATION_TO_WHITELISTED_ACCOUNTS = false;
    });

    test("should not delete whitelist entry if whitelisting is done by domain", async () => {
      config.RESTRICT_REGISTRATION_TO_WHITELISTED_ACCOUNTS = true;
      await insertUsers([admin]);
      await insertEntry([entryBaseDomainTwo]);

      const res = await request(app)
        .post("/v1/auth/register")
        .send({ email: userTwo.email, password: userTwo.password })
        .expect(httpStatus.CREATED);

      console.log(res.body);
      expect(
        await (
          await emailIsWhitelisted(`hallo@${entryBaseDomainTwo.emailOrDomain}`)
        ).result
      ).toBe(true);
      config.RESTRICT_REGISTRATION_TO_WHITELISTED_ACCOUNTS = false;
    });

    test("should return 400 error if email is invalid", async () => {
      newUser.email = "invalidEmail";

      await request(app)
        .post("/v1/auth/register")
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 400 error if email is already used", async () => {
      await insertUsers([userOne]);
      newUser.email = userOne.email;

      await request(app)
        .post("/v1/auth/register")
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 400 error if password length is less than 8 characters", async () => {
      newUser.password = "passwo1";

      await request(app)
        .post("/v1/auth/register")
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 400 error if password is not complex enough", async () => {
      newUser.password = "password";

      await request(app)
        .post("/v1/auth/register")
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);

      newUser.password = "11111111";

      await request(app)
        .post("/v1/auth/register")
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe("POST /v1/auth/login", () => {
    test("should return 200 and login user if email and password match", async () => {
      await insertUsers([userOne]);
      const loginCredentials = {
        email: userOne.email,
        password: userOne.password,
      };

      const res = await request(app)
        .post("/v1/auth/login")
        .send(loginCredentials)
        .expect(httpStatus.OK)
        .expect(hasRefreshCookie);

      expect(res.body).toMatchObject({
        access: { token: expect.anything(), expires: expect.anything() },
        user: {
          email: userOne.email,
          emailIsVerified: false,
          name: userOne.name,
          role: "USER",
          uuid: expect.anything(),
        },
      });
    });

    test("should return 200 and login developer with long-runnning access token", async () => {
      await insertUsers([developer]);
      const loginCredentials = {
        email: developer.email,
        password: developer.password,
      };

      const res = await request(app)
        .post("/v1/auth/login")
        .send(loginCredentials)
        .expect(httpStatus.OK)
        .expect(hasRefreshCookie);

      expect(res.body).toMatchObject({
        access: { token: expect.anything(), expires: expect.anything() },
        user: {
          email: developer.email,
          emailIsVerified: false,
          name: developer.name,
          role: "DEVELOPER",
          uuid: expect.anything(),
        },
      });

      // The access token of developer accounts should be valid for roughly one year
      expect(
        dayjs(res.body.access.expires).isAfter(dayjs().add(364, "day"))
      ).toBe(true);
    });

    test("should return 200 and login user if email and password match, whitelist is activated & mail is verified", async () => {
      await insertUsers([{ ...userOne, emailIsVerified: true }]);
      config.RESTRICT_REGISTRATION_TO_WHITELISTED_ACCOUNTS = true;
      const loginCredentials = {
        email: userOne.email,
        password: userOne.password,
      };

      const res = await request(app)
        .post("/v1/auth/login")
        .send(loginCredentials)
        .expect(httpStatus.OK)
        .expect(hasRefreshCookie);

      expect(res.body).toMatchObject({
        access: { token: expect.anything(), expires: expect.anything() },
        user: {
          email: userOne.email,
          emailIsVerified: true,
          name: userOne.name,
          role: "USER",
          uuid: expect.anything(),
        },
      });

      config.RESTRICT_REGISTRATION_TO_WHITELISTED_ACCOUNTS = false;
    });

    test("should return 401 error if whitelist is activated and email is not confirmed", async () => {
      await insertUsers([{ ...userOne, emailIsVerified: false }]);
      config.RESTRICT_REGISTRATION_TO_WHITELISTED_ACCOUNTS = true;

      const loginCredentials = {
        email: userOne.email,
        password: userOne.password,
      };

      const res = await request(app)
        .post("/v1/auth/login")
        .send(loginCredentials)
        .expect(httpStatus.UNAUTHORIZED);

      expect(res.body).toEqual({
        code: httpStatus.UNAUTHORIZED,
        message: "Please confirm your email",
      });

      config.RESTRICT_REGISTRATION_TO_WHITELISTED_ACCOUNTS = true;
    });

    test("should return 401 error if there are no users with that email", async () => {
      const loginCredentials = {
        email: userOne.email,
        password: userOne.password,
      };

      const res = await request(app)
        .post("/v1/auth/login")
        .send(loginCredentials)
        .expect(httpStatus.UNAUTHORIZED);

      expect(res.body).toEqual({
        code: httpStatus.UNAUTHORIZED,
        message: "Incorrect email or password",
      });
    });

    test("should return 401 error if password is wrong", async () => {
      await insertUsers([userOne]);
      const loginCredentials = {
        email: userOne.email,
        password: "wrongPassword1",
      };

      const res = await request(app)
        .post("/v1/auth/login")
        .send(loginCredentials)
        .expect(httpStatus.UNAUTHORIZED);

      expect(res.body).toEqual({
        code: httpStatus.UNAUTHORIZED,
        message: "Incorrect email or password",
      });
    });
  });

  describe("POST /v1/auth/logout", () => {
    test("should return 204 if refresh token is valid", async () => {
      await insertUsers([userOne]);
      const refreshToken = await tokenService.generateRefreshToken(
        userOne.uuid
      );

      const res = await request(app)
        .post("/v1/auth/logout")
        .set("Cookie", [`refreshCookie=${refreshToken.token}`])
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbRefreshTokenDoc = await tokenHandler.findOne({
        token: refreshToken.token,
        type: TokenType.REFRESH,
      });
      expect(dbRefreshTokenDoc).toBe(null);
    });

    test("should return 400 error if refresh cookie is missing", async () => {
      await request(app)
        .post("/v1/auth/logout")
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should 204 even if the refresh token is not found in the database, the logout is pointless anyway", async () => {
      await insertUsers([userOne]);
      const refreshTokenExpires = dayjs().add(
        config.JWT_REFRESH_EXPIRATION_DAYS,
        "days"
      );
      const refreshToken = tokenService.generateToken(
        userOne.uuid,
        refreshTokenExpires,
        TokenType.REFRESH,
        config.REFRESH_TOKEN_SECRET
      );
      await request(app)
        .post("/v1/auth/logout")
        .set("Cookie", [`refreshCookie=${refreshToken}`])
        .send()
        .expect(httpStatus.NO_CONTENT);
    });

    test("should return 204 even if the refresh token is blacklisted, the logout is pointless anyway", async () => {
      await insertUsers([userOne]);
      const refreshTokenExpires = dayjs().add(
        config.JWT_REFRESH_EXPIRATION_DAYS,
        "days"
      );
      const refreshToken = tokenService.generateToken(
        userOne.uuid,
        refreshTokenExpires,
        TokenType.REFRESH,
        config.REFRESH_TOKEN_SECRET
      );
      await tokenService.saveToken(
        refreshToken,
        userOne.uuid,
        refreshTokenExpires,
        TokenType.REFRESH,
        true
      );

      await request(app)
        .post("/v1/auth/logout")
        .set("Cookie", [`refreshCookie=${refreshToken}`])
        .send()
        .expect(httpStatus.NO_CONTENT);
    });
  });

  describe("POST /v1/auth/refresh-tokens", () => {
    test("should return 200 a new access & refresh token if refresh token is valid", async () => {
      await insertUsers([userOne]);
      const refreshToken = await tokenService.generateRefreshToken(
        userOne.uuid
      );

      const res = await request(app)
        .post("/v1/auth/refresh-tokens")
        .set("Cookie", [`refreshCookie=${refreshToken.token}`])
        .send()
        .expect(httpStatus.OK)
        .expect(hasRefreshCookie);

      expect(res.body).toMatchObject({
        access: { token: expect.anything(), expires: expect.anything() },
        user: {
          email: userOne.email,
          emailIsVerified: false,
          name: userOne.name,
          role: "USER",
          uuid: expect.anything(),
        },
      });

      expect(res.body).not.toHaveProperty("refresh");
    });

    test("should return 400 error if refresh token is missing from cookie", async () => {
      await request(app)
        .post("/v1/auth/refresh-tokens")
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 401 error if refresh token is signed using an invalid secret", async () => {
      await insertUsers([userOne]);
      const refreshTokenExpires = dayjs().add(
        config.JWT_REFRESH_EXPIRATION_DAYS,
        "days"
      );
      const refreshToken = tokenService.generateToken(
        userOne.uuid,
        refreshTokenExpires,
        TokenType.REFRESH,
        "invalid secret"
      );
      await tokenService.saveToken(
        refreshToken,
        userOne.uuid,
        refreshTokenExpires,
        TokenType.REFRESH,
        false
      );

      await request(app)
        .post("/v1/auth/refresh-tokens")
        .set("Cookie", [`refreshCookie=${refreshToken}`])
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test("should return 401 error if refresh token is not found in the database", async () => {
      await insertUsers([userOne]);
      const refreshTokenExpires = dayjs().add(
        config.JWT_REFRESH_EXPIRATION_DAYS,
        "days"
      );
      const refreshToken = tokenService.generateToken(
        userOne.uuid,
        refreshTokenExpires,
        TokenType.REFRESH,
        config.REFRESH_TOKEN_SECRET
      );
      await request(app)
        .post("/v1/auth/refresh-tokens")
        .set("Cookie", [`refreshCookie=${refreshToken}`])
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test("should return 401 error if refresh token is blacklisted", async () => {
      await insertUsers([userOne]);
      const refreshTokenExpires = dayjs().add(
        config.JWT_REFRESH_EXPIRATION_DAYS,
        "days"
      );
      const refreshToken = tokenService.generateToken(
        userOne.uuid,
        refreshTokenExpires,
        TokenType.REFRESH,
        config.REFRESH_TOKEN_SECRET
      );
      await tokenService.saveToken(
        refreshToken,
        userOne.uuid,
        refreshTokenExpires,
        TokenType.REFRESH,
        true
      );
      await request(app)
        .post("/v1/auth/refresh-tokens")
        .set("Cookie", [`refreshCookie=${refreshToken}`])
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });

    test("should return 401 error if refresh token as well as the login is expired", async () => {
      await insertUsers([userOne]);
      const refreshTokenExpires = dayjs().subtract(1, "minutes");
      const refreshToken = tokenService.generateToken(
        userOne.uuid,
        refreshTokenExpires,
        TokenType.REFRESH,
        config.REFRESH_TOKEN_SECRET
      );
      await tokenService.saveToken(
        refreshToken,
        userOne.uuid,
        refreshTokenExpires,
        TokenType.REFRESH,
        false
      );
      await request(app)
        .post("/v1/auth/refresh-tokens")
        .set("Cookie", [`refreshCookie=${refreshToken}`])
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe("POST /v1/auth/forgot-password", () => {
    beforeEach(() => {
      // @ts-ignore
      jest.spyOn(emailService.transporter, "sendMail").mockResolvedValue();
    });

    test("should return 204 and send reset password email to the user", async () => {
      await insertUsers([userOne]);

      const sendResetPasswordEmailSpy = jest.spyOn(
        emailService,
        "sendResetPasswordEmail"
      );

      await request(app)
        .post("/v1/auth/forgot-password")
        .send({ email: userOne.email })
        .expect(httpStatus.NO_CONTENT);

      expect(sendResetPasswordEmailSpy).toHaveBeenCalledWith(
        userOne.email,
        expect.any(String)
      );
      const resetPasswordToken = sendResetPasswordEmailSpy.mock.calls[0][1];
      const dbResetPasswordTokenDoc = await tokenHandler.findOne({
        token: resetPasswordToken,
        type: TokenType.RESET_PASSWORD,
      });
      expect(dbResetPasswordTokenDoc).toBeDefined();
    });

    test("should return 400 if email is missing", async () => {
      await insertUsers([userOne]);

      await request(app)
        .post("/v1/auth/forgot-password")
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 404 if email does not belong to any user", async () => {
      await request(app)
        .post("/v1/auth/forgot-password")
        .send({ email: userOne.email })
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe("POST /v1/auth/reset-password", () => {
    test("should return 204 and reset the password", async () => {
      await insertUsers([userOne]);

      const resetPasswordToken = await tokenService.generateResetPasswordToken(
        userOne.email
      );

      await request(app)
        .post("/v1/auth/reset-password")
        .send({ password: "434rmo4fm4rmkds", token: resetPasswordToken })
        .expect(httpStatus.NO_CONTENT);

      const dbUser = await UserHandler.findByUuidOrId(userOne.uuid);
      const isPasswordMatch = await UserHandler.isPasswordMatch(
        "434rmo4fm4rmkds",
        dbUser!
      );

      expect(isPasswordMatch).toBe(true);

      const dbResetPasswordToken = await tokenHandler.findOne({
        token: resetPasswordToken,
        type: TokenType.RESET_PASSWORD,
      });
      expect(dbResetPasswordToken).toBe(null);
    });

    test("should return 400 if reset password token is missing", async () => {
      await insertUsers([userOne]);

      await request(app)
        .post("/v1/auth/reset-password")
        .send({ password: "434rmo4fm4rmkds" })
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 401 if reset password token is blacklisted", async () => {
      await insertUsers([userOne]);

      const tokenExpires = dayjs().add(
        config.RESET_PASSWORD_EXPIRATION_MINUTES,
        "minutes"
      );
      const resetPasswordToken = tokenService.generateToken(
        userOne.uuid,
        tokenExpires,
        TokenType.RESET_PASSWORD,
        config.ACCESS_TOKEN_SECRET
      );
      await tokenService.saveToken(
        resetPasswordToken,
        userOne.uuid,
        tokenExpires,
        TokenType.RESET_PASSWORD,
        true
      );

      await request(app)
        .post("/v1/auth/reset-password")
        .send({ password: "434rmo4fm4rmkds", token: resetPasswordToken })
        .expect(httpStatus.UNAUTHORIZED);
    });

    test("should return 401 if reset password token is expired", async () => {
      await insertUsers([userOne]);
      const expires = dayjs().subtract(1, "minutes");
      const resetPasswordToken = tokenService.generateToken(
        userOne.uuid,
        expires,
        TokenType.RESET_PASSWORD,
        config.ACCESS_TOKEN_SECRET
      );

      await tokenService.saveToken(
        resetPasswordToken,
        userOne.uuid,
        expires,
        TokenType.RESET_PASSWORD
      );

      await request(app)
        .post("/v1/auth/reset-password")
        .send({ password: "434rmo4fm4rmkds", token: resetPasswordToken })
        .expect(httpStatus.UNAUTHORIZED);
    });

    test("should return 401 if user is not found", async () => {
      await insertUsers([userOne]);
      const expires = dayjs().add(
        config.RESET_PASSWORD_EXPIRATION_MINUTES,
        "minutes"
      );
      const resetPasswordToken = await tokenService.generateResetPasswordToken(
        userOne.email
      );
      await UserHandler.remove(userOne.uuid);

      await request(app)
        .post("/v1/auth/reset-password")
        .send({ password: "434rmo4fm4rmkds", token: resetPasswordToken })
        .expect(httpStatus.UNAUTHORIZED);
    });

    test("should return 400 if password is missing or invalid", async () => {
      await insertUsers([userOne]);

      const resetPasswordToken = await tokenService.generateResetPasswordToken(
        userOne.email
      );

      await request(app)
        .post("/v1/auth/reset-password")
        .send({ token: resetPasswordToken })
        .expect(httpStatus.BAD_REQUEST);

      await request(app)
        .post("/v1/auth/reset-password")
        .send({ password: "short1", token: resetPasswordToken })
        .expect(httpStatus.BAD_REQUEST);

      await request(app)
        .post("/v1/auth/reset-password")
        .send({ password: "password123", token: resetPasswordToken })
        .expect(httpStatus.BAD_REQUEST);

      await request(app)
        .post("/v1/auth/reset-password")
        .send({ password: "11111111", token: resetPasswordToken })
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe("POST /v1/auth/send-verification-email", () => {
    beforeEach(() => {
      jest.spyOn(emailService.transporter, "sendMail");
    });

    test("should return 204 and send verification email to the user", async () => {
      await insertUsers([userOne]);

      const sendVerificationEmailSpy = jest.spyOn(
        emailService,
        "sendVerificationEmail"
      );

      await request(app)
        .post("/v1/auth/send-verification-email")
        .set("Authorization", `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.NO_CONTENT);

      expect(sendVerificationEmailSpy).toHaveBeenCalledWith(
        userOne.email,
        expect.any(String)
      );
      const verifyEmailToken = sendVerificationEmailSpy.mock.calls[0][1];
      const dbVerifyEmailToken = await tokenHandler.findOne({
        token: verifyEmailToken,
        type: TokenType.VERIFY_EMAIL,
      });

      expect(dbVerifyEmailToken).toBeDefined();
    });

    test("should return 401 error if access token is missing", async () => {
      await insertUsers([userOne]);

      await request(app)
        .post("/v1/auth/send-verification-email")
        .send()
        .expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe("POST /v1/auth/verify-email", () => {
    test("should return 204 and verify the email", async () => {
      await insertUsers([userOne]);
      const verifyEmailToken = await tokenService.generateVerifyEmailToken(
        userOne
      );

      await request(app)
        .post("/v1/auth/verify-email")
        .send({ token: verifyEmailToken })
        .expect(httpStatus.NO_CONTENT);

      const dbUser = await UserHandler.findByUuidOrId(userOne.uuid);

      expect(dbUser!.emailIsVerified).toBe(true);

      const dbVerifyEmailToken = await tokenHandler.findOne({
        token: verifyEmailToken,
        type: TokenType.VERIFY_EMAIL,
      });
      expect(dbVerifyEmailToken).toBe(null);
    });

    test("should return 400 if verify email token is missing", async () => {
      await insertUsers([userOne]);

      await request(app)
        .post("/v1/auth/verify-email")
        .send()
        .expect(httpStatus.BAD_REQUEST);
    });

    test("should return 401 if verify email token is blacklisted", async () => {
      await insertUsers([userOne]);

      const tokenExpires = dayjs().add(
        config.VERIFY_EMAIL_EXPIRATION_MINUTES,
        "minutes"
      );
      const verifyEmailToken = tokenService.generateToken(
        userOne.uuid,
        tokenExpires,
        TokenType.VERIFY_EMAIL,
        config.ACCESS_TOKEN_SECRET
      );
      await tokenService.saveToken(
        verifyEmailToken,
        userOne.uuid,
        tokenExpires,
        TokenType.VERIFY_EMAIL,
        true
      );

      await request(app)
        .post("/v1/auth/verify-email")
        .send({ token: verifyEmailToken })
        .expect(httpStatus.UNAUTHORIZED);
    });

    test("should return 401 if verify email token is expired", async () => {
      await insertUsers([userOne]);
      const expires = dayjs().subtract(1, "minutes");
      const verifyEmailToken = tokenService.generateToken(
        userOne.uuid,
        expires,
        TokenType.VERIFY_EMAIL,
        config.ACCESS_TOKEN_SECRET
      );
      await tokenService.saveToken(
        verifyEmailToken,
        userOne.uuid,
        expires,
        TokenType.VERIFY_EMAIL
      );

      await request(app)
        .post("/v1/auth/verify-email")
        .send({ token: verifyEmailToken })
        .expect(httpStatus.UNAUTHORIZED);
    });
  });
});

describe("Auth middleware", () => {
  test("should call next with no errors if access token is valid", async () => {
    await insertUsers([userOne]);
    const req = httpMocks.createRequest({
      headers: { Authorization: `Bearer ${userOneAccessToken}` },
    });
    const next = jest.fn();

    await auth()(req, httpMocks.createResponse(), next);

    expect(next).toHaveBeenCalledWith();
    //@ts-ignore
    expect(req.user!.uuid).toEqual(userOne.uuid);
  });

  test("should call next with unauthorized error if access token is not found in header", async () => {
    await insertUsers([userOne]);
    const req = httpMocks.createRequest();
    const next = jest.fn();

    await auth()(req, httpMocks.createResponse(), next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: httpStatus.UNAUTHORIZED,
        message: "Please authenticate",
      })
    );
  });

  test("should call next with unauthorized error if access token is not a valid jwt token", async () => {
    await insertUsers([userOne]);
    const req = httpMocks.createRequest({
      headers: { Authorization: "Bearer randomToken" },
    });
    const next = jest.fn();

    await auth()(req, httpMocks.createResponse(), next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    expect(next).toHaveBeenCalledWith(
      //INFO: this is not the right error as the validation middleware will already throw with an validation error
      expect.objectContaining({
        statusCode: httpStatus.UNAUTHORIZED,
        message: "Please authenticate",
      })
    );
  });

  test("should call next with unauthorized error if the token is not an access token", async () => {
    await insertUsers([userOne]);
    const refreshToken = await tokenService.generateRefreshToken(userOne.uuid);
    const req = httpMocks.createRequest({
      headers: { Authorization: `Bearer ${refreshToken}` },
    });
    const next = jest.fn();

    await auth()(req, httpMocks.createResponse(), next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: httpStatus.UNAUTHORIZED,
        message: "Please authenticate",
      })
    );
  });

  test("should call next with unauthorized error if access token is generated with an invalid secret", async () => {
    await insertUsers([userOne]);
    const expires = dayjs().add(
      config.JWT_ACCESS_EXPIRATION_MINUTES,
      "minutes"
    );
    const accessToken = tokenService.generateToken(
      userOne.uuid,
      expires,
      TokenType.ACCESS,
      "invalidSecret"
    );
    const req = httpMocks.createRequest({
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const next = jest.fn();

    await auth()(req, httpMocks.createResponse(), next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: httpStatus.UNAUTHORIZED,
        message: "Please authenticate",
      })
    );
  });

  test("should call next with unauthorized error if access token is expired", async () => {
    await insertUsers([userOne]);
    const expires = dayjs().subtract(1, "minutes");
    const accessToken = tokenService.generateToken(
      userOne.uuid,
      expires,
      TokenType.ACCESS,
      config.ACCESS_TOKEN_SECRET
    );
    const req = httpMocks.createRequest({
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const next = jest.fn();

    await auth()(req, httpMocks.createResponse(), next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: httpStatus.UNAUTHORIZED,
        message: "Please authenticate",
      })
    );
  });

  test("should call next with unauthorized error if user is not found", async () => {
    const req = httpMocks.createRequest({
      headers: { Authorization: `Bearer ${userOneAccessToken}` },
    });
    const next = jest.fn();

    await auth()(req, httpMocks.createResponse(), next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: httpStatus.UNAUTHORIZED,
        message: "Please authenticate",
      })
    );
  });

  test("should call next with forbidden error if user does not have required rights and userId is not in params", async () => {
    await insertUsers([userOne]);
    const req = httpMocks.createRequest({
      headers: { Authorization: `Bearer ${userOneAccessToken}` },
    });
    const next = jest.fn();

    await auth("anyRight")(req, httpMocks.createResponse(), next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: httpStatus.FORBIDDEN,
        message: "Forbidden",
      })
    );
  });

  test("should call next with no errors if user does not have required rights but userId is in params", async () => {
    await insertUsers([userOne]);
    const req = httpMocks.createRequest({
      headers: { Authorization: `Bearer ${userOneAccessToken}` },
      params: { userUuid: userOne.uuid },
    });
    const next = jest.fn();

    await auth("anyRight")(req, httpMocks.createResponse(), next);

    expect(next).toHaveBeenCalledWith();
  });

  test("should call next with no errors if user has required rights", async () => {
    await insertUsers([admin]);
    const req = httpMocks.createRequest({
      headers: { Authorization: `Bearer ${adminAccessToken}` },
      params: { userUuid: userOne.uuid },
    });
    const next = jest.fn();

    await auth(...adminRights)(req, httpMocks.createResponse(), next);

    expect(next).toHaveBeenCalledWith();
  });
});
