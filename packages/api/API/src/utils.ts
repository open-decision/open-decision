import express from "express";
import jwt from "jsonwebtoken";
const APP_SECRET = "SUPER_INSECURE_SECRET";

function getTokenPayload(token: string) {
  return jwt.verify(token, APP_SECRET);
}

function getUserId(req: express.Request, authToken: string) {
  if (req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      if (!token) {
        throw new Error("No token found");
      }
      const userId = getTokenPayload(token);
      return userId;
    }
  } else if (authToken) {
    const userId = getTokenPayload(authToken);
    return userId;
  }

  throw new Error("Not authenticated");
}

module.exports = {
  APP_SECRET,
  getUserId,
};
