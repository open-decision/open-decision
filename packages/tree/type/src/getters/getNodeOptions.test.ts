import { test, expect } from "vitest";
import { treeMock } from "../mocks";
import { getNodeOptions } from "./getNodeOptions";

test("should get all connectable nodes but only with name and id", () => {
  const nodes = getNodeOptions(treeMock)(
    "e35ba071-6c5f-414f-98b1-a898305e038c"
  );

  expect(nodes).toMatchInlineSnapshot(`
    {
      "65f93264-6354-4e0b-86c1-3cc9e85db77a": {
        "id": "65f93264-6354-4e0b-86c1-3cc9e85db77a",
        "name": "Zweiter Knoten",
      },
      "72444c0f-8838-43f6-b395-bf3207386ac2": {
        "id": "72444c0f-8838-43f6-b395-bf3207386ac2",
        "name": "Dritter Knoten",
      },
      "8edc4369-3906-4dbc-be29-b560c742a806": {
        "id": "8edc4369-3906-4dbc-be29-b560c742a806",
        "name": "Dritter Knoten",
      },
      "9716912b-a124-4148-9faf-afb04629aca1": {
        "id": "9716912b-a124-4148-9faf-afb04629aca1",
        "name": "Dritter Knoten",
      },
    }
  `);
});
