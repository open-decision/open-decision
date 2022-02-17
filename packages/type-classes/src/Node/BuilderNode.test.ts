import * as BuilderNode from "./BuilderNode";

// ------------------------------------------------------------------
// Mock Data

const node: BuilderNode.TNode = {
  name: "Coolste Node",
  id: "5da4752a-ae4c-4124-b47c-0e9ac0e96971",
  position: { x: 100, y: 200 },
  relations: {},
  content: [],
};

// ------------------------------------------------------------------
// Tests

describe("BuilderNode", () => {
  test("should create a valid associated Node", () => {
    const newNode = BuilderNode.createNewAssociatedNode(node, node);

    expect(newNode.position).not.toEqual(node.position);
  });
});
