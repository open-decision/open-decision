import { NextMiddleware, NextResponse } from "next/server";
import { client } from "@open-decision/api-client";
import { APIError, ODError } from "@open-decision/type-classes";
import { authCookieConfig } from "./utils/auth";

export const middleware: NextMiddleware = async (request) => {
  const OD = client({ urlPrefix: `${process.env.OD_API_ENDPOINT}/v1` });

  try {
    const refreshToken = request.cookies.get("refreshToken");
    const token = request.cookies.get("token");

    const response = NextResponse.next();

    if (token) {
      return;
    }

    if (refreshToken) {
      const { data: authData, response: authResponse } =
        await OD.auth.refreshToken({ body: { refreshToken } });

      if (authData instanceof ODError) throw authResponse;

      response.cookies.set("refreshToken", authData.access.refreshToken.token, {
        ...authCookieConfig,
        maxAge:
          Number(process.env.JWT_REFRESH_EXPIRATION_DAYS ?? 7) * 86400 * 1000,
        domain: request.nextUrl.hostname,
      });
      response.cookies.set("token", authData.access.token.token, {
        ...authCookieConfig,
        maxAge: Number(process.env.JWT_ACCESS_EXPIRATION_MINUTES ?? 15) * 60,
        domain: request.nextUrl.hostname,
      });

      return response;
    }

    throw new APIError({
      code: "UNAUTHENTICATED",
      message: "The user is not authenticated",
    });
  } catch (error) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";

    return NextResponse.redirect(url);
  }
};

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/settings", "/", "/builder/:path*"],
};
