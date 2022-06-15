import { assert } from "console";
import request from "supertest";

const refreshCookieRegex = new RegExp(/refreshCookie=([\d\w-_.]*)/gm);

export const hasRefreshCookie = (res: request.Response) => {
  assert("set-cookie" in res.header);
  assert(refreshCookieRegex.test(res.header["set-cookie"][0]));
};

export const hasNoRefreshCookie = (res: request.Response) => {
  assert(!("set-cookie" in res.header));
};

export const extractRefreshToken = (rawCookieString: string) => {
  const match = refreshCookieRegex.exec(rawCookieString);
  if (match) {
    return match[1];
  }
  return undefined;
};
