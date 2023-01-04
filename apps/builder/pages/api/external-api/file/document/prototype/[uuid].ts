import { safeFetchJSON } from "@open-decision/api-helpers";
import { APIError, isAPIError } from "@open-decision/type-classes";
import { NextApiHandler } from "next";

const fileDownload: NextApiHandler = async (req, res) => {
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
    const path = req.url
      ?.split("external-api")[1]
      .replace("prototype", "preview");
    const { status, data } = await safeFetchJSON(
      `${process.env["NEXT_PUBLIC_OD_API_ENDPOINT"]}/v1${path}`,
      {
        body,
        headers,
        method: req.method,
      },
      {}
    );

    res.setHeader("Cache-Control", "no-store");
    return res.status(status).send(data.body);
  } catch (error) {
    if (!(isAPIError(error) && error.code === "UNAUTHORIZED")) {
      const errorToReturn = isAPIError(error)
        ? error
        : new APIError({
            code: "UNEXPECTED_ERROR",
            message: "An unexpected error occurred.",
          });

      return res.status(errorToReturn.statusCode).json(errorToReturn);
    }

    const path = req.url?.split("external-api")[1];

    if (!path) throw new Error();

    try {
      const { data, status } = await safeFetchJSON(
        `${process.env["NEXT_PUBLIC_OD_API_ENDPOINT"]}/v1${path}`,
        {
          body,
          headers,
          method: "POST",
        },
        {}
      );

      res.status(status).json(data);
    } catch (error) {
      const errorToReturn = isAPIError(error)
        ? error
        : new APIError({
            code: "UNEXPECTED_ERROR",
            message: "An unexpected error occurred.",
          });

      return res.status(errorToReturn.statusCode).json(errorToReturn);
    }
  }
};

export default fileDownload;
