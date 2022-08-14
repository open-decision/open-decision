import { NextMiddleware, NextResponse } from "next/server";
import { client } from "@open-decision/api-client";
import { APIError, ODError } from "@open-decision/type-classes";
import { authCookieConfig } from "./utils/auth";

export const middleware: NextMiddleware = async (request) => {
  const OD = client({
    urlPrefix: `${process.env.NEXT_PUBLIC_OD_API_ENDPOINT}/v1`,
    fetchFunction: safeFetch,
  });

  try {
    const refreshToken = request.cookies.get("refreshToken");
    const token = request.cookies.get("token");

    const response = NextResponse.next();

    if (token) {
      return;
    }

    if (refreshToken) {
      const { data } = await OD.auth.refreshToken({ body: { refreshToken } });

      if (data instanceof ODError) throw data;

      response.cookies.set("refreshToken", data.access.refreshToken.token, {
        ...authCookieConfig,
        maxAge:
          Number(process.env.JWT_REFRESH_EXPIRATION_DAYS ?? 7) * 86400 * 1000,
        domain: process.env.DOMAIN,
      });
      response.cookies.set("token", data.access.token.token, {
        ...authCookieConfig,
        maxAge: Number(process.env.JWT_ACCESS_EXPIRATION_MINUTES ?? 15) * 60,
        domain: process.env.DOMAIN,
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
