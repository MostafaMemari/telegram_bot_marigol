import { JobModel } from "../model/job.model";
import { sendToTelegramChannel } from "../bot/handlers/sendToTelegramChannel";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: "error", message: "Method not allowed" });
  }

  try {
    const now = new Date();
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000); // نیم ساعت قبل

    console.log(`\n[CRON CHECK] Now: ${now.toLocaleString()} | 30 min ago: ${thirtyMinutesAgo.toLocaleString()}`);

    const jobs = await JobModel.find().lean();
    console.log(`[CRON CHECK] Found ${jobs.length} jobs in DB`);

    for (const job of jobs) {
      const [hour, minute] = job.time.split(":").map(Number);
      const jobTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0);

      console.log(`[JOB CHECK] Job ID: ${job._id} | Time: ${job.time} | JobTime: ${jobTime.toLocaleString()}`);

      if (jobTime <= now && jobTime > thirtyMinutesAgo) {
        console.log(`[JOB MATCH] ✅ Job ${job._id} is in range. Sending to channel...`);

        try {
          await sendToTelegramChannel(job.productId, job.channelId);
          await JobModel.deleteOne({ _id: job._id });
          console.log(`[JOB DONE] ✅ Sent and deleted job ${job._id} scheduled at ${job.time}`);
        } catch (err: any) {
          console.error(`[JOB ERROR] ❌ Error sending job ${job._id}:`, err.message);
        }
      } else {
        console.log(`[JOB SKIP] ⏭ Job ${job._id} not in range. (jobTime=${jobTime.toISOString()}, now=${now.toISOString()})`);
      }
    }

    res.status(200).json({ status: "ok", checked: jobs.length });
  } catch (err: any) {
    console.error("❌ [CRON ERROR]:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
}
