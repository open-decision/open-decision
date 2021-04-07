import { useService } from "@xstate/react";
import { MainContent } from "components";
import { authService, NodeEditor, Tree as TreeType } from "features";
import { useTreeQuery } from "internalTypes";
import { useRouter } from "next/router";

export default function Tree() {
  const [state] = useService(authService);
  const router = useRouter();

  const tree = useTreeQuery<TreeType>(
    state.context.client,
    { id: router.query.id as string },
    {
      select: ({ decisionTree }) => ({
        config: { nodeTypes: {}, portTypes: {} },
        state: {
          position: { zoom: 1, coordinates: [0, 0] },
          treeName: decisionTree?.name ?? "",
          nodes: {},
          edges: {},
        },
      }),
    }
  );

  return (
    <MainContent>
      {tree.isSuccess && <NodeEditor tree={tree.data} />}
    </MainContent>
  );
}
