import { JobModel } from "../model/job.model";
import { sendToTelegramChannel } from "../bot/handlers/sendToTelegramChannel";

export async function GET() {
  const now = new Date();

  const jobs = await JobModel.find().lean();

  for (const job of jobs) {
    const [hour, minute] = job.time.split(":").map(Number);
    const jobTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0);

    if (jobTime <= now) {
      await sendToTelegramChannel(job.productId, job.channelId);
      await JobModel.deleteOne({ _id: job._id });
      console.log(`[Job] Sent and deleted job ${job._id} scheduled at ${job.time}`);
    }
  }

  return new Response("Checked jobs");
}
