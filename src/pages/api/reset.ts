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

  try {
    // Delete all existing entries
    await db.grid.deleteMany();

    // Create 98 new entries
    const entries = Array.from({ length: 98 }, (_, i) => ({
      number: i + 1,
      src: "/unknown.png",
    }));

    await db.grid.createMany({
      data: entries,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Reset error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to reset database" });
  }
}
