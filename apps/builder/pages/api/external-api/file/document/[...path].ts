import { safeFetchJSON } from "@open-decision/api-helpers";
import { APIError, isAPIError } from "@open-decision/type-classes";
import { NextApiHandler } from "next";

const fileDownload: NextApiHandler = async (req, res) => {
  const token = req.cookies["token"];

  try {
    const path = req.url?.split("external-api")[1];
    const { status, data } = await safeFetchJSON(
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

    res.setHeader("Cache-Control", "no-store");
    return res.status(status).send(data.body);
  } catch (error) {
    console.error(error);
    const errorToReturn = isAPIError(error)
      ? error
      : new APIError({
          code: "UNEXPECTED_ERROR",
          message: "An unexpected error occurred.",
        });

    return res.status(errorToReturn.statusCode).json(errorToReturn);
  }
};

export default fileDownload;
