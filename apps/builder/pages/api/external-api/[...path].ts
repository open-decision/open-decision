import { NextApiHandler } from "next";
import { refreshAuth } from "../../../utils/auth";

const SilentAuth: NextApiHandler = async (req, res) => {
  try {
    const refreshedToken = await refreshAuth(req, res);

    const path = req.url?.split("external-api")[1];
    const response = await fetch(`${process.env.OD_API_ENDPOINT}/v1${path}`, {
      body: req.method === "GET" ? undefined : req.body,
      headers: {
        authorization: `Bearer ${refreshedToken}`,
      },
      method: req.method,
    });

    return res.json(await response.json());
  } catch (error) {
    return res.redirect("/auth/login");
  }
};

export default SilentAuth;
