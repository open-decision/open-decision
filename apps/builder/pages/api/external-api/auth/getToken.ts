import { NextApiHandler } from "next";
import { withAuthRefresh } from "../../../../utils/auth";

const getToken: NextApiHandler = async (req, res) => {
  const token = req.cookies["token"];

  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({ token });
};

export default withAuthRefresh(getToken);
