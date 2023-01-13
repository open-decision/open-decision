import { safeFetchWithParse } from "@open-decision/api-helpers";
import { loginOutput } from "@open-decision/api-specification";
import { setCookieHeaders } from "../../../../utils/auth";
import type { NextApiHandler } from "next";
import { APIError, isAPIError } from "@open-decision/type-classes";

const authCatch: NextApiHandler = async (req, res) => {
  try {
    const { response, data } = await safeFetchWithParse({
      apiUrl: `${process.env["NEXT_PUBLIC_OD_API_ENDPOINT"]}/v1`,
      proxyUrl: `${process.env["NEXT_PUBLIC_OD_BUILDER_ENDPOINT"]}/api/external-api`,
    })(`auth/${req.query["slug"]}`, {
      json: req.body,
      method: req.method,
      validation: loginOutput,
      origin: "api route",
      proxied: false,
    });

    setCookieHeaders(req, res, data);

    res.setHeader("Cache-Control", "no-store");
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("authCatch", error);
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
