import schedule from "node-schedule";
import { sendToTelegramChannel } from "../bot/handlers/sendToTelegramChannel";
import { channels } from "../constants/channels";
import { JobModel } from "../model/job.model";

export async function readJobs() {
  return await JobModel.find().lean();
}

export async function addJob(job: {
  productId: string;
  time: string;
  chatId: number;
  messageId: number;
  productDetails: string;
  channelId: string;
}) {
  const [hour, minute] = job.time.split(":").map(Number);
  const now = new Date();
  const jobTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0);

  if (jobTime < now) jobTime.setDate(jobTime.getDate() + 1);

  const channelName = Object.keys(channels).find((key) => channels[key as keyof typeof channels] === job.channelId) || "unknown";

  const jobId = Date.now();

  const newJob = await JobModel.create({
    id: jobId,
    ...job,
    channelName,
    date: jobTime,
  });

  schedule.scheduleJob(jobId.toString(), jobTime, async () => {
    await sendToTelegramChannel(job.productId, job.channelId);
    await removeJob(jobId);
  });

  console.log(`[scheduler] job ${jobId} scheduled for ${jobTime.toISOString()}`);
  return newJob;
}

export async function removeJob(jobId: number) {
  const idStr = jobId.toString();

  const scheduled = schedule.scheduledJobs[idStr];
  if (scheduled) {
    scheduled.cancel();
    console.log(`[scheduler] job ${idStr} cancelled`);
  } else {
    console.log(`[scheduler] no job found with id ${idStr}`);
  }

  await JobModel.deleteOne({ id: jobId });
  console.log(`[MongoDB] job ${idStr} removed`);
}
