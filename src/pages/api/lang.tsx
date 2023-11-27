import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  const db = client.db("TAVERNA-DB");

  const {method} = req;

  switch (method) {
    case 'GET':
      try {
        const categories = await db.collection('lang').find({}).toArray();
        res.status(200).json({ success: true, data: categories });
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
