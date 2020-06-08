import { WelcomeScreen } from "components";

export const Canvas = ({ children, className }) => {
  return (
    <div
      className={className}
      sx={{
        backgroundColor: "#E5E5E5",
        flex: "1",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div sx={{ width: "60vw" }}>
        <WelcomeScreen username="Dirk_laywer23"></WelcomeScreen>
        {children}
      </div>
    </div>
  );
};
