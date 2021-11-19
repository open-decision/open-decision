import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset } from "jest-mock-extended";
import { DeepMockProxy } from "jest-mock-extended/lib/mjs/Mock";
import prisma from "./init-prisma-client";

jest.mock("./init-prisma-client", () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
