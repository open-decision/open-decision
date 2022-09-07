import { refreshAuth } from "../../../../utils/auth";
import { NextApiHandler } from "next";
import { withSentry } from "@sentry/nextjs";

const getToken: NextApiHandler = async (req, res) => {
  try {
    const refreshedToken = await refreshAuth(req, res);
    return res.status(200).json({ token: refreshedToken });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export default withSentry(getToken);
