import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token =
    typeof req.query?.token === "string"
      ? req.query?.token
      : req.query?.token?.[0];

  if (!token)
    return res
      .status(401)
      .send({ error: "Missing email verification token in url" });

  const response = await fetch(
    `${process.env.OD_API_ENDPOINT}/v1/auth/verify-email`,
    {
      method: "POST",
      body: JSON.stringify({ token }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (response.ok) return res.redirect("/");

  return res.status(500).send({ error: response.statusText });
}
