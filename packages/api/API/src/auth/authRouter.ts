import express, { response } from "express";
import { signup, login, refreshAndStoreNewToken } from "./authHandler";

export const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
  const { accessToken, refreshToken, user } = await login(
    req.body.email,
    req.body.password,
    req.app.locals.prisma
  );

  //Handle refresh token - set httpOnly cookie
  res.cookie("refreshCookie", refreshToken, {
    maxAge: 86400,
    secure: true,
    httpOnly: true,
    sameSite: "none",
  });

  //Set the return body
  res.json({ accessToken: `JWT ${accessToken}`, status: "ok" });
  res.end();
});

authRouter.post("/signup", async (req, res) => {
  const { accessToken, refreshToken, user } = await signup(
    req.body.email,
    req.body.password,
    req.app.locals.prisma
  );

  //Handle refresh token - set httpOnly cookie
  res.cookie("refreshCookie", refreshToken, {
    maxAge: 86400,
    secure: true,
    httpOnly: true,
    sameSite: "none",
  });

  //Set the return body
  res.json({
    accessToken: `JWT ${accessToken}`,
    user: user.email,
    status: "ok",
  });

  res.end();
});

authRouter.post("/refresh", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Not authorized1." });
  }
  const accessToken = authHeader.replace("JWT ", "");

  if (!accessToken) {
    return res.status(401).json({ error: "Not authorized2." });
  }

  const refreshToken = req.cookies.refreshCookie;

  if (!refreshToken) {
    return res.status(401).json({ error: "Not authorized3." });
  }

  const { newAccessToken, newRefreshToken, user } =
    await refreshAndStoreNewToken(
      accessToken,
      refreshToken,
      req.app.locals.prisma
    );

  //Handle refresh token - set httpOnly cookie
  res.cookie("refreshCookie", newRefreshToken, {
    maxAge: 86400,
    secure: true,
    httpOnly: true,
    sameSite: "none",
  });

  //Set the return body
  res.json({
    accessToken: `JWT ${newAccessToken}`,
    status: "ok",
  });

  // Already done by auth handler

  // //store the refresh token in the database - this for now restricts the no. of refresh token to one
  // req.app.locals.prisma.user.update({
  //   where: { id: user.id },
  //   data: { refreshToken: refreshToken },
  // });

  res.end();
});
