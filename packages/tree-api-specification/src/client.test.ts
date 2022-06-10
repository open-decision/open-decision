import { describe, test } from "vitest";
import { client } from "./client";

describe("Tests the tree-specification", () => {
  const OD = client({
    headers: {
      authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyYWNkZWMyNy0xNDUyLTQ2MTUtYmUxOC04MjhmZDg4NDExMjMiLCJ0eXBlIjoiQUNDRVNTIiwiZXhwIjoxNjg2MjEzMDQ1LCJpYXQiOjE2NTQ2NzcwNDV9.hM3OPUwTf6au-0Um_052TRXuXDj-hRz8zpq7P_bdJaE",
    },
  });

  test("create tree", async () => {
    expect(
      await OD.trees.create({ body: { name: "Test" } })
    ).not.toThrowError();
  });

  test("get trees collection", async () => {
    expect(await OD.trees.get({})).not.toThrowError();
  });
});
