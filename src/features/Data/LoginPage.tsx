import { MainContent } from "components";
import { LoginCard } from "features";

export const LoginPage = () => {
  return (
    <MainContent
      css={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <LoginCard />
    </MainContent>
  );
};
