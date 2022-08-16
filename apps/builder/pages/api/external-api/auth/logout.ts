import { deleteCookies } from "../../../../utils/auth";
import { NextApiHandler } from "next";
import { client } from "@open-decision/api-client";
import { safeFetch } from "@open-decision/api-helpers";

const logout: NextApiHandler = async (req, res) => {
  const OD = client({
    urlPrefix: `${process.env.NEXT_PUBLIC_OD_API_ENDPOINT}/v1`,
    fetchFunction: safeFetch,
  });

  await OD.auth.logout({});
  deleteCookies(res);

  return res.status(200).json({});
};

export default logout;
