import { MainContent } from "components";
import { NodeEditor } from "features";

export default function Tree(): JSX.Element {
  return (
    <MainContent css={{ overflow: "hidden" }}>
      <NodeEditor />
    </MainContent>
  );
}
