import { deleteCookies } from "../../../../utils/auth";
import { NextApiHandler } from "next";
import { client } from "@open-decision/api-client";

const logout: NextApiHandler = async (req, res) => {
  const OD = client({ urlPrefix: `${process.env.OD_API_ENDPOINT}/v1` });
  OD.auth.logout({});

  deleteCookies(res);

  return res.status(200).json({});
};

export default logout;
