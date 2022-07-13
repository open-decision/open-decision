import { safeFetch } from "@open-decision/api-helpers";
import { loginOutput } from "@open-decision/auth-api-specification";
import { setCookieHeaders } from "../../../../utils/auth";
import { NextApiHandler } from "next";
import { APIError, isAPIError } from "@open-decision/type-classes";

const authCatch: NextApiHandler = async (req, res) => {
  const path = req.url?.split("external-api")[1];
  try {
    const authResponse = await safeFetch(
      `${process.env.OD_API_ENDPOINT}/v1/${path}`,
      {
        body: JSON.stringify(req.body),
        method: req.method,
      },
      { validation: loginOutput }
    );

    setCookieHeaders(res, authResponse.data);

    return res.status(200).redirect(307, "/");
  } catch (error) {
    if (isAPIError(error)) {
      return res.status(error.statusCode).json(error);
    }

    return res.status(500).json(
      new APIError({
        code: "UNEXPECTED_ERROR",
        message: "An unexpected error occured",
      })
    );
  }
};

export default authCatch;
