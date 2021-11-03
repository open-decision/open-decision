import { signup, login, refreshAndStoreNewToken } from "./../auth/auth-handler";
import { prismaMock } from "./prisma-tests/singleton";
import { Role, Prisma } from "@prisma/client";
import { Api400Error } from "../error-handling/api-errors";
import { BaseError } from "../error-handling/base-error";

describe("Authentication - test login", () => {
  it("should login user ", async () => {
    const user = {
      email: "hello@prisma.io",
      name: "fsd",
      password: "$2a$10$i8w3.o3Rr41Pe5/sRBqIRekwwJ9vsY5UbxCbEZjO2Sqmdho06j1Ca",
      id: 5,
      uuid: "7348567b-ef89-44d7-a939-4bcae5f57599",
      role: Role.USER,
      refreshToken: "",
      refreshTokenExpiry: null,
      loginExpiry: null,
    };

    prismaMock.user.findUnique.mockResolvedValue(user);

    await expect(
      login("helloprisma.io", "allemeineentchen", prismaMock)
    ).resolves.toEqual(
      expect.objectContaining({
        accessToken: expect.stringMatching(
          /^^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
        ),
        refreshToken: expect.stringMatching(
          /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
        ),
        user: user,
      })
    );
  });
});

describe("Authentication - test login", () => {
  it("should fail as password does not match", async () => {
    const user = {
      email: "hello@prisma.io",
      name: "fsd",
      password: "$2a$10$i8w3.o3Rr41Pe5sRBqIRekwwJ9vsY5UbxCbEZjO2Sqmdho06j1Ca",
      id: 5,
      uuid: "7348567b-ef89-44d7-a939-4bcae5f57599",
      role: Role.USER,
      refreshToken: "",
      refreshTokenExpiry: null,
      loginExpiry: null,
    };

    prismaMock.user.findUnique.mockResolvedValue(user);

    await expect(
      login("helloprisma.io", "allemeineentchen", prismaMock)
    ).resolves.toEqual(
      new BaseError({
        name: "InvalidCredentials",
        message:
          "The user does not exist or the password and e-mail do not match.",
      })
    );
  });
});

describe("Authentication - test login", () => {
  it("should fail for unknown user ", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    await expect(
      login("unknown@od.io", "allemeineentchen", prismaMock)
    ).resolves.toEqual(
      new BaseError({
        name: "InvalidCredentials",
        message:
          "The user does not exist or the password and e-mail do not match.",
      })
    );
  });
});

describe("Authentication - test sign-up", () => {
  it("should fail as e-mail adress is already in use ", async () => {
    prismaMock.user.create.mockImplementation(() => {
      throw new Prisma.PrismaClientKnownRequestError("fsdf", "P2002", "Mocked");
    });

    await expect(
      signup("helloprisma.io", "allemeineentchen", prismaMock)
    ).resolves.toEqual(
      new Api400Error({
        name: "EmailAlreadyUsed",
        message:
          "The e-mail adress is already being used. Please choose another e-mail address.",
      })
    );
  });
});

describe("Authentication - test sign-up", () => {
  it("should login user ", async () => {
    const user = {
      email: "hello@prisma.io",
      name: "fsd",
      password: "$2a$10$i8w3.o3Rr41Pe5/sRBqIRekwwJ9vsY5UbxCbEZjO2Sqmdho06j1Ca",
      id: 5,
      uuid: "7348567b-ef89-44d7-a939-4bcae5f57599",
      role: Role.USER,
      refreshToken: "",
      refreshTokenExpiry: null,
      loginExpiry: null,
    };

    prismaMock.user.create.mockResolvedValue(user);

    await expect(
      signup("helloprisma.io", "allemeineentchen", prismaMock)
    ).resolves.toEqual(
      expect.objectContaining({
        accessToken: expect.stringMatching(
          /^^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
        ),
        refreshToken: expect.stringMatching(
          /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
        ),
        user: {
          ...user,
          password: expect.any(String),
        },
      })
    );
  });
});
// test("should update a users name ", async () => {
//   const user = {
//     id: 1,
//     name: "Rich Haines",
//     email: "hello@prisma.io",
//   };

//   prismaMock.user.update.mockResolvedValue(user);

//   await expect(updateUsername(user)).resolves.toEqual({
//     id: 1,
//     name: "Rich Haines",
//     email: "hello@prisma.io",
//   });
// });

// test("should fail if user does not accept terms", async () => {
//   const user = {
//     id: 1,
//     name: "Rich Haines",
//     email: "hello@prisma.io",
//     acceptTermsAndConditions: false,
//   };

//   prismaMock.user.create.mockRejectedValue(
//     new Error("User must accept terms!")
//   );

//   await expect(createUser(user)).resolves.toEqual(
//     new Error("User must accept terms!")
//   );
// });
