import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/server/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const data = await db.grid.findMany();
  res.status(200).json(data);
};

export default handler;
