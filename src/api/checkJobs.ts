import { JobModel } from "../model/job.model";
import { sendToTelegramChannel } from "../bot/handlers/sendToTelegramChannel";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: "error", message: "Method not allowed" });
  }

  try {
    const now = new Date();
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

    const jobs = await JobModel.find().lean();

    for (const job of jobs) {
      const [hour, minute] = job.time.split(":").map(Number);
      const jobTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0);

      if (jobTime <= now && jobTime > thirtyMinutesAgo) {
        await sendToTelegramChannel(job.productId, job.channelId);
        await JobModel.deleteOne({ _id: job._id });
        console.log(`[Job] ✅ Sent and deleted job ${job._id} scheduled at ${job.time}`);
      }
    }

    res.status(200).json({ status: "ok", checked: jobs.length });
  } catch (err: any) {
    console.error("❌ Error in cron handler:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
}
