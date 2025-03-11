import connectMongo from "../../../../lib/mongodb";
import Check from "../../../../models/Check";
import Monitor from "../../../../models/Monitor";
import { verify } from "jsonwebtoken";

export default async function handler(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    await connectMongo();

    const { id } = req.query;
    const { startDate, endDate } = req.query;

    const monitor = await Monitor.findOne({ _id: id, user: decoded.id });

    if (!monitor) {
      return res.status(404).json({ message: "Monitor not found" });
    }

    const checks = await Check.find({
      monitor: id,
      timestamp: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ timestamp: 1 });

    return res.status(200).json({ checks });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}