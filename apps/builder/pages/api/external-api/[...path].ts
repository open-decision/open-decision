import { safeFetch } from "@open-decision/api-helpers";
import { APIError, isAPIError } from "@open-decision/type-classes";
import { NextApiHandler } from "next";
import { omitBy } from "remeda";
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
    if (req.query.path === undefined)
      throw new APIError({
        code: "NOT_FOUND",
        message: "The requested url does not exist.",
      });

    const queryParams = omitBy(
      req.query,
      (value, key) => key === "path" || typeof value !== "string"
    ) as Record<string, string>;

    const path =
      typeof req.query.path === "string"
        ? req.query.path
        : req.query.path.join("/");

    const response = await safeFetch({
      apiUrl: `${process.env["NEXT_PUBLIC_OD_API_ENDPOINT"]}/v1`,
      proxyUrl: `${process.env["NEXT_PUBLIC_OD_BUILDER_ENDPOINT"]}/api/external-api`,
    })(path, {
      body: req.method === "GET" ? undefined : body,
      headers,
      method: req.method,
      origin: "api route",
      proxied: false,
      searchParams: queryParams,
    });

    const responseContentType = response.headers.get("Content-Type");

    if (response.status === 204) return res.status(response.status).end();

    if (responseContentType) {
      res.setHeader("Content-Type", responseContentType);
    }

    res.setHeader("Cache-Control", "no-store");

    return res.status(response.status).send(response.body);
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
