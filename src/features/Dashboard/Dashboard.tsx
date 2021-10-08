import React, { FC } from "react";
import { TreeList } from "./TreeList";
import { NewTreeButton } from "./NewTreeButton";
import { StyleObject, styled, Heading } from "@open-legal-tech/design-system";
import { useTreeStore } from "./hooks/useTrees";

const DashboardGrid = styled("div", {
  display: "grid",
  gridTemplateColumns: `1fr min(1000px, 100%) 1fr`,
  gridTemplateRows: "max-content 1fr",
});

type DashboardProps = { css?: StyleObject };

export const Dashboard: FC<DashboardProps> = ({ css }) => {
  const [initialize, trees] = useTreeStore(
    React.useCallback((state) => [state.initialize, state.trees], [])
  );

  React.useEffect(() => initialize(), [initialize]);

  return (
    <DashboardGrid css={css}>
      <div className="col-start-2 mt-24 mx-4 md:mx-8 flex flex-col justify-end items-start">
        <Heading className="mb-6" size="large">
          Hallo!
        </Heading>
        <NewTreeButton />
      </div>

      <div className="col-start-2 row-start-2 mx-4 md:mx-8">
        <TreeList data={trees} />
      </div>
    </DashboardGrid>
  );
};
