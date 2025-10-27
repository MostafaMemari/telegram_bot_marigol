import fs from "fs";
import path from "path";
import schedule from "node-schedule";
import { sendToTelegramChannel } from "../bot/handlers/sendToTelegramChannel";
import { channels } from "../constants/channels";

const JOBS_FILE = path.join(__dirname, "../jobs.json");

export function readJobs() {
  if (!fs.existsSync(JOBS_FILE)) return [];
  const data = fs.readFileSync(JOBS_FILE, "utf-8");
  return data ? JSON.parse(data) : [];
}

function saveJobs(jobs: any[]) {
  fs.writeFileSync(JOBS_FILE, JSON.stringify(jobs, null, 2), "utf-8");
}

export function addJob(job: {
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

  const jobs = readJobs();
  const jobId = Date.now();
  const newJob = { id: jobId, ...job, channelName, date: jobTime.toISOString() };
  jobs.push(newJob);
  saveJobs(jobs);

  schedule.scheduleJob(jobId.toString(), jobTime, async () => {
    await sendToTelegramChannel(job.productId, job.channelId);
    removeJob(jobId);
  });
}

export function removeJob(jobId: number) {
  const jobs = readJobs().filter((j: any) => j.id !== jobId);
  saveJobs(jobs);
}

export function restoreJobs() {
  const jobs = readJobs();
  const now = new Date();

  for (const job of jobs) {
    const jobTime = new Date(job.date);
    if (jobTime > now) {
      schedule.scheduleJob(job.id.toString(), jobTime, async () => {
        console.log(`♻️ اجرای دوباره ${job.productId} برای کانال ${job.channelName} (${job.channelId})`);
        await sendToTelegramChannel(job.productId, job.channelId);
        removeJob(job.id);
      });
    } else {
      removeJob(job.id);
    }
  }

  console.log(`✅ ${jobs.length} زمان‌بندی بازگردانی شد.`);
}
