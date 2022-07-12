import { safeFetch } from "@open-decision/api-helpers";
import { loginOutput } from "@open-decision/auth-api-specification";
import { setCookieHeaders } from "../../../../utils/auth";
import { NextApiHandler } from "next";

const login: NextApiHandler = async (req, res) => {
  const path = req.url?.split("external-api")[1];
  const loginResponse = await safeFetch(
    `${process.env.OD_API_ENDPOINT}/v1/${path}`,
    {
      body: req.body,
      method: req.method,
    },
    { validation: loginOutput }
  );

  setCookieHeaders(res, loginResponse.data);

  return res.status(200).redirect(307, "/");
};

export default login;
