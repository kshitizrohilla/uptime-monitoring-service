import connectMongo from "../../../lib/mongodb";
import Incident from "../../../models/Incident";
import Monitor from "../../../models/Monitor";
import { verify } from "jsonwebtoken";

export default async function handler(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    await connectMongo();

    if (req.method === "GET") {
      const monitors = await Monitor.find({ user: decoded.id });
      const monitorIds = monitors.map(m => m._id);

      const incidents = await Incident.find({ monitor: { $in: monitorIds } })
        .sort({ startTime: -1 })
        .populate('monitor', 'name url');

      return res.status(200).json(incidents);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}