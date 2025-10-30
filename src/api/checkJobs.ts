import { JobModel } from "../model/job.model";
import { sendToTelegramChannel } from "../bot/handlers/sendToTelegramChannel";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: "error", message: "Method not allowed" });
  }

  try {
    const now = new Date();
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

    console.log(`\n[CRON CHECK] Now (UTC): ${now.toISOString()} | 30min ago: ${thirtyMinutesAgo.toISOString()}`);

    const jobs = await JobModel.find().lean();
    console.log(`[CRON CHECK] Found ${jobs.length} jobs in DB`);

    for (const job of jobs) {
      const [hour, minute] = job.time.split(":").map(Number);

      // تبدیل زمان ایران (UTC+3:30) به UTC
      const jobTimeUTC = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour - 3, minute - 30, 0);

      console.log(`[JOB CHECK] Job ${job._id} | Time(IR): ${job.time} | JobTime(UTC): ${jobTimeUTC.toISOString()}`);

      if (jobTimeUTC <= now && jobTimeUTC > thirtyMinutesAgo) {
        console.log(`[JOB MATCH] ✅ Sending job ${job._id}...`);
        try {
          await sendToTelegramChannel(job.productId, job.channelId);
          await JobModel.deleteOne({ _id: job._id });
          console.log(`[JOB DONE] ✅ Sent & deleted job ${job._id}`);
        } catch (err: any) {
          console.error(`[JOB ERROR] ❌ ${job._id}: ${err.message}`);
        }
      } else {
        console.log(`[JOB SKIP] ⏭ Not in range.`);
      }
    }

    res.status(200).json({ status: "ok", checked: jobs.length });
  } catch (err: any) {
    console.error("❌ [CRON ERROR]:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
}
