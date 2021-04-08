import React from "react";
import { useAll_TreesQuery, useUserQuery } from "internalTypes";
import { TreeList } from "./TreeList";
import { validateTreeData } from "./dataValidation";
import { NewTreeButton } from "./NewTreeButton";
import { useService } from "@xstate/react";
import { authService } from "features";

export const Dashboard: React.FunctionComponent = () => {
  const [state] = useService(authService);

  const user = useUserQuery(state.context.client);
  const allTrees = useAll_TreesQuery(
    state.context.client,
    {},
    { select: validateTreeData }
  );

  return (
    <div className="dashboard-grid">
      <div className="col-start-2 mt-24 mx-4 md:mx-8 flex flex-col justify-end items-start">
        <h2 className="text-5xl mb-6">
          Hallo {user.data?.me?.username ?? "Dirk Lawyer"}
        </h2>
        <NewTreeButton />
      </div>

      <div className="col-start-2 row-start-2 mx-4 md:mx-8">
        {allTrees.isError ? (
          <span>Error :(</span>
        ) : allTrees.isLoading ? (
          <span>Laden</span>
        ) : allTrees.isSuccess ? (
          <TreeList data={allTrees.data.validData} />
        ) : null}
      </div>
    </div>
  );
};
