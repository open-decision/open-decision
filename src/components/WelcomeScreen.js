import { Greeting } from "components";
import { Button } from "theme-ui";

export const WelcomeScreen = ({ username }) => {
  return (
    <div
      sx={{
        height: "40vh",
        display: "flex",
        justifyContent: "flex-end",
        flexDirection: "column",
        alignItems: "start",
      }}
    >
      <Greeting username={username}></Greeting>
      <Button
        sx={{
          borderRadius: "15px",
          padding: 4,
          fontSize: 3,
          marginTop: 4,
          backgroundColor: "tertiary.primary",
          color: "tertiary.contrast",
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div sx={{ fontSize: 6, marginRight: 3 }}>+</div>
        <div> Neuen Baum hinzufügen</div>
      </Button>
    </div>
  );
};
