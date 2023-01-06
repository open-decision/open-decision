import { safeFetchJSON } from "@open-decision/api-helpers";
import { APIError, isAPIError } from "@open-decision/type-classes";
import { NextApiHandler } from "next";
import { withAuthRefresh } from "../../../utils/auth";

const ProxyAPI: NextApiHandler = async (req, res) => {
  const token = req.cookies["token"];

  const headers: HeadersInit = {
    authorization: `Bearer ${token}`,
    "Content-Type": req.headers["content-type"] ?? "application/json",
  };

  const body =
    req.headers["content-type"] === "application/json"
      ? JSON.stringify(req.body)
      : req.body;

  try {
    const path = req.url?.split("external-api")[1];
    const { status, data } = await safeFetchJSON(
      `${process.env["NEXT_PUBLIC_OD_API_ENDPOINT"]}/v1${path}`,
      {
        body: req.method === "GET" ? undefined : body,
        headers,
        method: req.method,
      },
      { origin: "api route" }
    );

    res.setHeader("Cache-Control", "no-store");
    if (status === 204) return res.status(status).end();

    return res.status(status).json(data);
  } catch (error) {
    console.error("general proxy", error);
    const errorToReturn = isAPIError(error)
      ? error
      : new APIError({
          code: "UNEXPECTED_ERROR",
          message: "An unexpected error occurred.",
        });

    return res.status(errorToReturn.statusCode).json(errorToReturn);
  }
};

export default withAuthRefresh(ProxyAPI);
