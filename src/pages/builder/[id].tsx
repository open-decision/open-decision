import { MainContent } from "components/Layout";
import { NodeEditor } from "features/Builder/NodeEditor";

export default function Tree(): JSX.Element {
  return (
    <MainContent css={{ overflow: "hidden" }}>
      <TreeProvider>
        <NodeEditor />
      </TreeProvider>
    </MainContent>
  );
}
