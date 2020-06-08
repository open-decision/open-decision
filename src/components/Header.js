export const Header = ({ children, className }) => {
  return (
    <div
      sx={{
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        fontSize: 4,
      }}
      className={className}
    >
      {children}
    </div>
  );
};
