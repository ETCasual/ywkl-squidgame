import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../server/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { filename, number } = JSON.parse(req.body as string) as {
    filename: string;
    number: number;
  };

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const upload = await db.grid.update({
      where: { number: number },
      data: {
        src: `https://ywkl-squidgame.s3.ap-southeast-1.amazonaws.com/${filename}`,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (upload.id) {
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ error: "Failed to upload" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handler;
