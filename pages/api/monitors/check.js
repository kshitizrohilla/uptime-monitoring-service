import connectMongo from "../../../lib/mongodb";
import Monitor from "../../../models/Monitor";
import Check from "../../../models/Check";
import Incident from "../../../models/Incident";
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectMongo();

    const monitors = await Monitor.find({ active: true });
    const results = [];

    for (const monitor of monitors) {
      if (monitor.lastChecked) {
        const lastChecked = new Date(monitor.lastChecked);
        const now = new Date();
        const diffMinutes = (now - lastChecked) / (1000 * 60);

        if (diffMinutes < monitor.interval) {
          results.push({
            id: monitor._id,
            name: monitor.name,
            skipped: true,
            message: "Not time to check yet"
          });
          continue;
        }
      }

      try {
        const startTime = Date.now();

        const response = await axios({
          method: monitor.method,
          url: monitor.url,
          timeout: monitor.timeout * 1000,
          headers: Object.fromEntries(monitor.headers || {}),
          data: monitor.body || undefined
        });

        const responseTime = Date.now() - startTime;
        const statusCode = response.status;

        const isUp = statusCode === monitor.expectedStatusCode;

        const check = new Check({
          monitor: monitor._id,
          status: isUp ? "up" : "down",
          responseTime,
          statusCode
        });

        await check.save();

        monitor.lastChecked = new Date();
        monitor.status = isUp ? "up" : "down";
        await monitor.save();

        if (!isUp) {
          const incident = new Incident({
            monitor: monitor._id,
            startTime: new Date(),
            statusCode,
            reason: `Unexpected status code: ${statusCode}`
          });

          await incident.save();
        } else {
          const unresolvedIncident = await Incident.findOne({
            monitor: monitor._id,
            resolved: false
          });

          if (unresolvedIncident) {
            const endTime = new Date();
            const duration = (endTime - new Date(unresolvedIncident.startTime)) / 1000;

            unresolvedIncident.endTime = endTime;
            unresolvedIncident.duration = duration;
            unresolvedIncident.resolved = true;

            await unresolvedIncident.save();
          }
        }

        results.push({
          id: monitor._id,
          name: monitor.name,
          status: isUp ? "up" : "down",
          responseTime,
          statusCode
        });
      } catch (error) {
        const check = new Check({
          monitor: monitor._id,
          status: "down",
          responseTime: 0,
          statusCode: null
        });

        await check.save();

        monitor.lastChecked = new Date();
        monitor.status = "down";
        await monitor.save();

        const incident = new Incident({
          monitor: monitor._id,
          startTime: new Date(),
          reason: error.message
        });

        await incident.save();

        results.push({
          id: monitor._id,
          name: monitor.name,
          status: "down",
          error: error.message
        });
      }
    }

    return res.status(200).json({ results });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}