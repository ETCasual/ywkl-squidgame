/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { db } from "../../server/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  //   console.log("testing req.body", req.body);
  const { number } = req.body as {
    number: number;
  };
  console.log(number);

  if (isNaN(number)) {
    return res.status(400).json({ success: false, error: "Invalid number" });
  }

  try {
    await db.grid.update({
      where: { number: number },
      data: { src: "/unknown.png" },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Reset number error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to reset number" });
  }
}
