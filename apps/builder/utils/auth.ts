import { directClient } from "@open-decision/api-client";
import { TLoginOutput } from "@open-decision/api-specification";
import { APIError, isAPIError } from "@open-decision/type-classes";
import { serialize } from "cookie";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

export const authCookieConfig = {
  secure: process.env.NODE_ENV === "production" ? true : false,
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
} as const;

export const deleteCookies = (res: NextApiResponse) => {
  res.setHeader("Set-Cookie", [
    serialize("refreshToken", "removed", {
      ...authCookieConfig,
      maxAge: -1,
    }),
    serialize("token", "removed", {
      ...authCookieConfig,
      maxAge: -1,
    }),
  ]);
};

export const setCookieHeaders = (
  req: NextApiRequest,
  res: NextApiResponse,
  loginResponse: TLoginOutput
) => {
  res.setHeader("Set-Cookie", [
    serialize("refreshToken", loginResponse.access.refreshToken.token, {
      ...authCookieConfig,
      maxAge:
        Number(process.env["JWT_REFRESH_EXPIRATION_DAYS"] ?? 7) * 86400 * 1000,
    }),
    serialize("token", loginResponse.access.token.token, {
      ...authCookieConfig,
      maxAge: Number(process.env["JWT_ACCESS_EXPIRATION_MINUTES"] ?? 15) * 60,
    }),
  ]);
};

export const withAuthRefresh =
  (next: NextApiHandler) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.cookies["token"];
    const refreshToken = req.cookies["refreshToken"];

    // When the token is still valid we don't need to refresh it and just return it
    if (token) {
      return next(req, res);
    }

    // When there is a valid refreshToken we can use it to refresh the token
    try {
      if (refreshToken) {
        const { data: authData } = await directClient(
          "api auth refresh"
        ).auth.refreshToken({
          body: { refreshToken },
        });

        setCookieHeaders(req, res, authData);
        req.cookies["token"] = authData.access.token.token;
        req.cookies["refreshToken"] = authData.access.refreshToken.token;

        return next(req, res);
      }

      throw new APIError({
        code: "UNAUTHENTICATED",
        message: "The user is not authenticated",
      });
    } catch (error) {
      const errorToReturn = isAPIError(error)
        ? error
        : new APIError({
            code: "UNEXPECTED_ERROR",
            message: "An unexpected error occurred.",
          });

      return res.status(errorToReturn.statusCode).json(errorToReturn);
    }
  };
