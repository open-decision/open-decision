import { MainContent } from "components";
import { Dashboard } from "features";

type HomeProps = { className?: string };

export default function Home({ className }: HomeProps): JSX.Element {
  return (
    <MainContent
      className={className}
      css={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Dashboard css={{ flexGrow: 1 }} />
    </MainContent>
  );
}
