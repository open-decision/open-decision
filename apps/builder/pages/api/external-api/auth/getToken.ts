import { refreshAuth } from "../../../../utils/auth";
import { NextApiHandler } from "next";

const getToken: NextApiHandler = async (req, res) => {
  try {
    const refreshedToken = await refreshAuth(req, res);
    return res.status(200).json({ token: refreshedToken });
  } catch (error) {
    console.log(error);
    return res.redirect(303, "/auth/login");
  }
};

export default getToken;
