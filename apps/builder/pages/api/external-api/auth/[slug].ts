import { safeFetchJSON } from "@open-decision/api-helpers";
import { loginOutput } from "@open-decision/api-specification";
import { setCookieHeaders } from "../../../../utils/auth";
import type { NextApiHandler } from "next";
import { APIError, isAPIError } from "@open-decision/type-classes";

const authCatch: NextApiHandler = async (req, res) => {
  try {
    const authResponse = await safeFetchJSON(
      `${process.env["NEXT_PUBLIC_OD_API_ENDPOINT"]}/v1/auth/${req.query["slug"]}`,
      {
        body: req.body,
        method: req.method,
      },
      { validation: loginOutput }
    );

    setCookieHeaders(req, res, authResponse.data);

    res.setHeader("Cache-Control", "no-store");
    return res.status(authResponse.status).json(authResponse.data.user);
  } catch (error) {
    console.error(error);
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
