import { MainContent } from "components/Layout";
import { NodeEditor } from "features/Builder/NodeEditor";

export default function Home(): JSX.Element {
  return (
    <MainContent
      css={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Dashboard css={{ flexGrow: 1 }} />
    </MainContent>
  );
}
