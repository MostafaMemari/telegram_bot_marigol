import { JobModel } from "../model/job.model";
import { sendToTelegramChannel } from "../bot/handlers/sendToTelegramChannel";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: "error", message: "Method not allowed" });
  }

  try {
    const now = new Date();
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

    console.log(`\n[CRON CHECK] Now: ${now.toISOString()} | 30min ago: ${thirtyMinutesAgo.toISOString()}`);

    const jobs = await JobModel.find({
      sendAt: { $lte: now, $gt: thirtyMinutesAgo },
    }).lean();

    console.log(`[CRON CHECK] Found ${jobs.length} jobs ready to send.`);

    for (const job of jobs) {
      try {
        console.log(`[JOB SEND] 🚀 Sending job ${job._id} (${job.channelName})`);
        await sendToTelegramChannel(job.productId, job.channelId);
        await JobModel.deleteOne({ _id: job._id });
        console.log(`[JOB DONE] ✅ Job ${job._id} sent & removed`);
      } catch (err: any) {
        console.error(`[JOB ERROR] ❌ Job ${job._id}: ${err.message}`);
      }
    }

    res.status(200).json({ status: "ok", sent: jobs.length });
  } catch (err: any) {
    console.error("❌ [CRON ERROR]:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
}
