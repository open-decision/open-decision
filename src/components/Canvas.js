export const Canvas = ({ children, className }) => {
  return (
    <div className={className} sx={{ backgroundColor: "#E5E5E5" }}>
      {children}
    </div>
  );
};
