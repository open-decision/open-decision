import { deleteCookies } from "../../../../utils/auth";
import { NextApiHandler } from "next";
import { APIClient } from "@open-decision/api-client";

const logout: NextApiHandler = async (req, res) => {
  req.cookies.refreshToken
    ? await APIClient.auth.logout({
        body: { refreshToken: req.cookies.refreshToken },
      })
    : null;
  deleteCookies(res);

  return res.status(200).json({});
};

export default logout;
