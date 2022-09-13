import { safeFetch } from "@open-decision/api-helpers";
import { APIError, isAPIError } from "@open-decision/type-classes";
import { withSentry } from "@sentry/nextjs";
import { NextApiHandler } from "next";
import { withAuthRefresh } from "../../../utils/auth";

const ProxyAPI: NextApiHandler = async (req, res) => {
  const token = req.cookies["token"];

  try {
    const refreshedToken = await refreshAuth(req, res);

    const path = req.url?.split("external-api")[1];
    const { status, data } = await safeFetch(
      `${process.env["NEXT_PUBLIC_OD_API_ENDPOINT"]}/v1${path}`,
      {
        body: req.method === "GET" ? undefined : req.body,
        headers: {
          authorization: `Bearer ${token}`,
        },
        method: req.method,
      },
      {}
    );

    return res.status(status).json(data);
  } catch (error) {
    console.error(error);
    if (isAPIError(error)) return res.status(error.statusCode).json(error);

    return res.status(500).json(
      new APIError({
        code: "UNEXPECTED_ERROR",
        message: "An unexpected error occurred.",
      })
    );
  }
};

export default withSentry(withAuthRefresh(ProxyAPI));
