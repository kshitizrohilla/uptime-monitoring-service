import connectMongo from "../../../lib/mongodb";
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
      const monitors = await Monitor.find({ user: decoded.id }).sort({ createdAt: -1 });
      return res.status(200).json(monitors);
    }

    if (req.method === "POST") {
      const { name, url, method, interval, timeout, expectedStatusCode } = req.body;

      const newMonitor = new Monitor({
        user: decoded.id,
        name,
        url,
        method,
        interval,
        timeout,
        expectedStatusCode
      });

      await newMonitor.save();
      return res.status(201).json(newMonitor);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}