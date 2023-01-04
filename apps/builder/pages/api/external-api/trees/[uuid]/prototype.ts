import { safeFetchJSON } from "@open-decision/api-helpers";
import {
  getTreeDataInput,
  treeDataSingle,
  treePreview,
} from "@open-decision/api-specification";
import { APIError, isAPIError } from "@open-decision/type-classes";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  const token = req.cookies["token"];

  const reqData = getTreeDataInput
    .extend({ query: getTreeDataInput.shape.params })
    .omit({ params: true })
    .parse(req);

  if (token) {
    try {
      const { status, data } = await safeFetchJSON(
        `${process.env["NEXT_PUBLIC_OD_API_ENDPOINT"]}/v1/${treeDataSingle(
          reqData.query.uuid
        )}`,
        {
          headers: {
            cache: "no-cache",
            authorization: `Bearer ${token}`,
            "Content-Type": req.headers["content-type"] ?? "application/json",
          },
          method: req.method,
        },
        {}
      );

      res.setHeader("Cache-Control", "no-store");
      return res.status(status).json(data);
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
    }
  }

  const response = await fetchPrototypeUnauthenticated(reqData.query.uuid);

  if (isAPIError(response)) {
    return res.status(response.statusCode).json(response);
  }

  res.setHeader("Cache-Control", "no-store");
  return res.status(response.status).json(response.data);
};

async function fetchPrototypeUnauthenticated(uuid: string) {
  try {
    return await safeFetchJSON(
      `${process.env["NEXT_PUBLIC_OD_API_ENDPOINT"]}/v1${treePreview(uuid)}`,
      {
        headers: {
          cache: "no-cache",
          "Content-Type": "application/json",
        },
        method: "GET",
      },
      {}
    );
  } catch (error) {
    return isAPIError(error)
      ? error
      : new APIError({
          code: "UNEXPECTED_ERROR",
          message: "An unexpected error occurred.",
        });
  }
}

export default handler;
