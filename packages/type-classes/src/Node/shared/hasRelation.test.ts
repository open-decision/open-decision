import { hasRelation } from "./hasRelation";
import { nodeFixture } from "./Node.fixture";

describe("hasRelation", () => {
  test("should return true, because it finds the relation", () => {
    const result = hasRelation(
      nodeFixture,
      "5da4752a-ae4c-4124-b47c-0e9ac0e96971"
    );

    expect(result).toBeTruthy;
  });

  test("should fail with an error", () => {
    const result = hasRelation(nodeFixture, "obviously not a correct id");

    expect(result).toBeFalsy;
  });
});
