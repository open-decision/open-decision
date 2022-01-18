import { MainContent, LoginCard } from "components";
import { FC } from "react";

export const LoginPage: FC = () => {
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
