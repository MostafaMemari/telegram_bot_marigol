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
  const channelName = Object.keys(channels).find((key) => channels[key as keyof typeof channels] === job.channelId) || "unknown";

  const jobId = Date.now();

  const newJob = await JobModel.create({
    id: jobId,
    ...job,
    channelName,
    date: new Date(),
  });

  console.log(`[scheduler] job ${jobId} added for ${job.time}`);
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
