import { MainContent } from "components";
import { Dashboard } from "features";

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
