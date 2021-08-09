import React, { FC } from "react";
import { useAll_TreesQuery, useUserQuery } from "internalTypes";
import { TreeList } from "./TreeList";
import { validateTreeData } from "./dataValidation";
import { NewTreeButton } from "./NewTreeButton";
import { useService } from "@xstate/react";
import { authService } from "features";
import { StyleObject, styled, Heading } from "@open-legal-tech/design-system";

const DashboardGrid = styled("div", {
  display: "grid",
  gridTemplateColumns: `1fr min(1000px, 100%) 1fr`,
  gridTemplateRows: "max-content 1fr",
});

type DashboardProps = { css?: StyleObject };

export const Dashboard: FC<DashboardProps> = ({ css }) => {
  const [state] = useService(authService);

  const user = useUserQuery(state.context.client);
  const allTrees = useAll_TreesQuery(
    state.context.client,
    {},
    { select: validateTreeData }
  );

  return (
    <DashboardGrid css={css}>
      <div className="col-start-2 mt-24 mx-4 md:mx-8 flex flex-col justify-end items-start">
        <Heading className="mb-6" size="xl">
          Hallo {user.data?.me?.username ?? ""}
        </Heading>
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
    </DashboardGrid>
  );
};
