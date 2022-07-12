import * as jose from "jose";
import { getUnixTime } from "date-fns";

export async function hasTokenExpired(token: string, tokenSecret: string) {
  try {
    const { payload: tokenPayload } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(tokenSecret)
    );

    if (
      !tokenPayload ||
      !tokenPayload.exp ||
      tokenPayload.exp <= getUnixTime(Date.now())
    )
      return true;

    return false;
  } catch (error) {
    console.log(error);
    return true;
  }
}
