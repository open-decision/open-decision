import { safeFetch } from "@open-decision/api-helpers";
import { APIError, isAPIError } from "@open-decision/type-classes";
import { NextApiHandler } from "next";
import { refreshAuth } from "../../../utils/auth";

const SilentAuth: NextApiHandler = async (req, res) => {
  let refreshedToken: string;
  try {
    refreshedToken = await refreshAuth(req, res);
  } catch (error) {
    return res.redirect("/auth/login");
  }

  try {
    const path = req.url?.split("external-api")[1];
    const response = await safeFetch(
      `${process.env.OD_API_ENDPOINT}/v1${path}`,
      {
        body: req.method === "GET" ? undefined : req.body,
        headers: {
          authorization: `Bearer ${refreshedToken}`,
        },
        method: req.method,
      }
    );

    return res.json(response.data);
  } catch (error) {
    if (isAPIError(error)) return res.status(error.statusCode).json(error);

    return res
      .status(500)
      .json(
        new APIError({
          code: "UNEXPECTED_ERROR",
          message: "An unexpected error occurred.",
        })
      );
  }
};

export default SilentAuth;
