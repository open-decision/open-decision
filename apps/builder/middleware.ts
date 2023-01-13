import { NextMiddleware, NextResponse } from "next/server";
import { APIClient } from "@open-decision/api-client";
import { APIError, ODError } from "@open-decision/type-classes";
import { authCookieConfig } from "./utils/auth";

export const middleware: NextMiddleware = async (request) => {
  try {
    const refreshToken = request.cookies.get("refreshToken");
    const token = request.cookies.get("token");

    const response = NextResponse.next();

    if (token) {
      return response;
    }

    if (refreshToken) {
      const { data } = await APIClient.auth.refreshToken({
        body: { refreshToken: refreshToken.value },
      });

      if (data instanceof ODError) throw data;

      response.cookies.set("refreshToken", data.access.refreshToken.token, {
        ...authCookieConfig,
        maxAge:
          Number(process.env["JWT_REFRESH_EXPIRATION_DAYS"] ?? 7) *
          86400 *
          1000,
      });
      response.cookies.set("token", data.access.token.token, {
        ...authCookieConfig,
        maxAge: Number(process.env["JWT_ACCESS_EXPIRATION_MINUTES"] ?? 15) * 60,
      });

      return response;
    }

    throw new APIError({
      code: "UNAUTHENTICATED",
      message: "The user is not authenticated",
    });
  } catch (error) {
    console.error("middleware", error);
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";

    return NextResponse.redirect(url);
  }
};

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/settings", "/", "/builder/:path?"],
};
