/** @jsx jsx */
import { Button, SxStyleProp, jsx } from "theme-ui";
import { useHistory, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";
import { FunctionComponent } from "react";

export const AuthButton: FunctionComponent<{ className?: string }> = ({ className }) => {
  const auth = useAuth();
  let history = useHistory();
  let location = useLocation();

  let { from }: { from?: object } = location.state || { from: { pathname: "/" } };
  //TODO handle Auth Failure in UI
  return (
    <Button
      onClick={() => {
        return auth.user
          ? auth.signout(() => history.push("/"))
          : auth.signin({ callback: () => history.replace(from) });
      }}
      className={className}
    >
      {auth.user ? "Logout" : "Login"}
    </Button>
  );
};
