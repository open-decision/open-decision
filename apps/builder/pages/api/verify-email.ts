import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token =
    typeof req.query?.["token"] === "string"
      ? req.query?.["token"]
      : req.query?.["token"]?.[0];

  if (!token)
    return res
      .status(401)
      .send({ error: "Missing email verification token in url" });

  const response = await fetch(
    `${process.env["NEXT_PUBLIC_OD_API_ENDPOINT"]}/v1/auth/verify-email`,
    {
      method: "POST",
      body: JSON.stringify({ token }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (response.ok) return res.redirect(303, "/?notify=email-verified");

  return res.status(500).send({ error: response.statusText });
}

export default handler;
