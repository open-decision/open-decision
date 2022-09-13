import { refreshAuth } from "../../../../utils/auth";
import { NextApiHandler } from "next";
import { withSentry } from "@sentry/nextjs";
import { NextApiHandler } from "next";
import { withAuthRefresh } from "../../../../utils/auth";

const getToken: NextApiHandler = async (req, res) => {
  const token = req.cookies["token"];

  res.setHeader("Cache-Control", "no-store");
  return res.json({ token });
};

export default withSentry(withAuthRefresh(getToken));
