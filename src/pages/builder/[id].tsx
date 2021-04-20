import { useService } from "@xstate/react";
import { MainContent } from "components";
import { authService, NodeEditor, Tree as TreeType } from "features";
import {
  exampleNodeTypes,
  examplePortTypes,
} from "features/Builder/tests/nodes";
import { useTreeQuery } from "internalTypes";
import { useRouter } from "next/router";
import { Elements } from "react-flow-renderer";

const initialElements: Elements = [
  {
    id: "1",
    type: "input",
    data: { label: "Input Node" },
    position: { x: 250, y: 25 },
  },
  {
    id: "2",
    data: { label: "Default Node" },
    position: { x: 100, y: 125 },
  },
  {
    id: "3",
    type: "output",
    data: { label: "Output Node" },
    position: { x: 250, y: 250 },
  },
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e2-3", source: "2", target: "3", label: "Test" },
];

export default function Tree(): JSX.Element {
  const [state] = useService(authService);
  const router = useRouter();

  const tree = useTreeQuery<TreeType>(
    state.context.client,
    { id: router.query.id as string },
    {
      select: ({ decisionTree }) => ({
        config: { nodeTypes: exampleNodeTypes, portTypes: examplePortTypes },
        state: {
          treeName: decisionTree?.name ?? "",
          elements: initialElements,
        },
      }),
    }
  );

  return (
    <MainContent css={{ overflow: "hidden" }}>
      {tree.isSuccess && <NodeEditor tree={tree.data} />}
    </MainContent>
  );
}
