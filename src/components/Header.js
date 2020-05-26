/** @jsx jsx */
import { jsx } from "theme-ui";

export const Header = ({ children, className }) => {
  return (
    <div sx={{ backgroundColor: "green" }} className={className}>
      {children}
    </div>
  );
};
