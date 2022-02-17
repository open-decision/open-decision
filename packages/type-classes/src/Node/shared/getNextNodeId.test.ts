import { getNextNodeId } from "./getNextNodeId";
import { nodeFixture } from "./Node.fixture";

describe("getNextNodeId", () => {
  test("should get the correct next node id", () => {
    const result = getNextNodeId(nodeFixture, "Ja");

    expect(result).toBe("5da4752a-ae4c-4124-b47c-0e9ac0e96943");
  });

  test("should fail with an error", () => {
    const result = getNextNodeId(nodeFixture, "Nein");

    expect(result).toBeInstanceOf(Error);
  });
});
