import { type NextApiRequest, type NextApiResponse } from "next";

// skipcq: JS-0356
import { prisma } from "../../server/db/client";

// skipcq: JS-0116
const examples = async (req: NextApiRequest, res: NextApiResponse) => {
  // const examples = await prisma.example.findMany();
  res.status(200).json(examples);
};

export default examples;
