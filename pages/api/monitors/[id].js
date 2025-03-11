import connectMongo from "../../../lib/mongodb";
import Monitor from "../../../models/Monitor";
import Check from "../../../models/Check";
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

    if (req.method === "GET") {
      const monitor = await Monitor.findOne({ _id: id, user: decoded.id });

      if (!monitor) {
        return res.status(404).json({ message: "Monitor not found" });
      }

      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);

      const checks = await Check.find({
        monitor: id,
        timestamp: { $gte: yesterday }
      }).sort({ timestamp: 1 });

      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const yearAgo = new Date(now);
      yearAgo.setDate(yearAgo.getDate() - 365);

      const allChecks = await Check.find({
        monitor: id,
        timestamp: { $gte: yearAgo }
      });

      const uptime = {
        last7Days: calculateUptime(allChecks, sevenDaysAgo),
        last30Days: calculateUptime(allChecks, thirtyDaysAgo),
        last365Days: calculateUptime(allChecks, yearAgo)
      };

      return res.status(200).json({ monitor, checks, uptime });
    }

    if (req.method === "PUT") {
      const { name, url, method, interval, timeout, expectedStatusCode, active } = req.body;

      const monitor = await Monitor.findOne({ _id: id, user: decoded.id });

      if (!monitor) {
        return res.status(404).json({ message: "Monitor not found" });
      }

      monitor.name = name || monitor.name;
      monitor.url = url || monitor.url;
      monitor.method = method || monitor.method;
      monitor.interval = interval || monitor.interval;
      monitor.timeout = timeout || monitor.timeout;
      monitor.expectedStatusCode = expectedStatusCode || monitor.expectedStatusCode;
      monitor.active = active !== undefined ? active : monitor.active;

      await monitor.save();
      return res.status(200).json(monitor);
    }

    if (req.method === "DELETE") {
      const result = await Monitor.deleteOne({ _id: id, user: decoded.id });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Monitor not found" });
      }

      return res.status(200).json({ message: "Monitor deleted" });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

function calculateUptime(checks, since) {
  const relevantChecks = checks.filter(check => new Date(check.timestamp) >= since);

  if (relevantChecks.length === 0) return 100;

  const upChecks = relevantChecks.filter(check => check.status === "up");
  return (upChecks.length / relevantChecks.length) * 100;
}