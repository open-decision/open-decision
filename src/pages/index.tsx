import { Header } from "components/Header";
import { MainContent } from "components/Layout";
import { NodeEditor } from "features/Builder/NodeEditor";
import { EditorProvider } from "features/Builder/state/useEditor";
import { TreeProvider } from "features/Builder/state/useTree";
import { ReactFlowProvider } from "react-flow-renderer";

export default function Tree(): JSX.Element {
  return (
    <MainContent
      css={{
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "5fr 2fr",
        gridTemplateRows: "70px 1fr",
      }}
    >
      <Header css={{ gridColumn: "1", gridRow: "1" }} />
      <ReactFlowProvider>
        <TreeProvider>
          <EditorProvider>
            <NodeEditor css={{ gridColumn: "1 / -1", gridRow: "2" }} />
          </EditorProvider>
        </TreeProvider>
      </ReactFlowProvider>
    </MainContent>
  );
}
