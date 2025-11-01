import moment from "moment-timezone";
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
  const jobId = Date.now();

  const channelName = Object.keys(channels).find((key) => channels[key as keyof typeof channels] === job.channelId) || "unknown";

  const today = moment().tz("Asia/Tehran").format("YYYY-MM-DD");

  const sendAt = moment.tz(`${today} ${job.time}`, "YYYY-MM-DD HH:mm", "Asia/Tehran").utc().toDate();

  const newJob = await JobModel.create({
    id: jobId,
    productId: job.productId,
    sendAt,
    chatId: job.chatId,
    messageId: job.messageId,
    productDetails: job.productDetails,
    channelId: job.channelId,
    channelName,
    date: new Date(),
  });

  console.log(`[scheduler] ✅ Job ${jobId} scheduled for ${sendAt.toISOString()}`);
  return newJob;
}

export async function removeJob(jobId: number) {
  const result = await JobModel.deleteOne({ id: jobId });
  if (result.deletedCount > 0) {
    console.log(`[scheduler] job ${jobId} removed`);
  } else {
    console.warn(`[scheduler] job ${jobId} not found`);
  }
  return result;
}
