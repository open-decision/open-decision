import { Table } from "./Table/Table";
import React from "react";
import { PlusCircleOutline } from "@graywolfai/react-heroicons";
import { columns, defaultColumn } from "./Table/TableData";
import { Component, TreeNodes } from "@internalTypes/global";
import {
  All_TreesQuery,
  useAll_TreesQuery,
  useCreate_TreeMutation,
} from "@internalTypes/generated/graphql";
import * as E from "fp-ts/Either";
import { identity, pipe } from "fp-ts/lib/function";
import { hasPath } from "ramda";
import { Button } from "@components/index";

const getTreeData = (data: All_TreesQuery): E.Either<[], TreeNodes> =>
  hasPath(["allDecisionTrees", "edges"])(data)
    ? E.right(data.allDecisionTrees.edges.map((x) => x.node))
    : E.left([]);

//FIXME username is hardcoded
export const Dashboard: Component = () => {
  const [{ data, fetching, error }] = useAll_TreesQuery();
  const [, createTree] = useCreate_TreeMutation();

  const treeData = pipe(data, getTreeData, E.fold(identity, identity));

  return (
    <div className="bg-gray-300 dashboard-grid">
      <div className="col-start-2 mx-4 md:mx-8 flex flex-col justify-end items-start">
        <h2 className="text-3xl">Hallo Dirk_laywer23</h2>
        <Button
          level="primary"
          className="my-8"
          size="large"
          onClick={() =>
            createTree({
              input: {
                name: "Tes",
              },
            }).then((result) => console.log(result))
          }
        >
          <PlusCircleOutline className="w-8 h-8 mr-2 inline" />
          Neuen Baum erstellen
        </Button>
      </div>

      <div className="bg-gray-100 row-start-2 col-span-full"></div>
      <div className="col-start-2 row-start-2 mx-4 md:mx-8">
        {error ? (
          <p>Error :(</p>
        ) : fetching ? (
          <span>Laden</span>
        ) : (
          <Table
            columns={columns}
            data={treeData}
            defaultColumn={defaultColumn}
          />
        )}
      </div>
    </div>
  );
};
