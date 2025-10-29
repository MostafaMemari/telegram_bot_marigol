"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readJobs = readJobs;
exports.addJob = addJob;
exports.removeJob = removeJob;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const node_schedule_1 = __importDefault(require("node-schedule"));
const sendToTelegramChannel_1 = require("../bot/handlers/sendToTelegramChannel");
const channels_1 = require("../constants/channels");
const JOBS_FILE = path_1.default.join(__dirname, "../jobs.json");
function readJobs() {
    if (!fs_1.default.existsSync(JOBS_FILE))
        return [];
    const data = fs_1.default.readFileSync(JOBS_FILE, "utf-8");
    return data ? JSON.parse(data) : [];
}
function saveJobs(jobs) {
    fs_1.default.writeFileSync(JOBS_FILE, JSON.stringify(jobs, null, 2), "utf-8");
}
function addJob(job) {
    const [hour, minute] = job.time.split(":").map(Number);
    const now = new Date();
    const jobTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0);
    if (jobTime < now)
        jobTime.setDate(jobTime.getDate() + 1);
    const channelName = Object.keys(channels_1.channels).find((key) => channels_1.channels[key] === job.channelId) || "unknown";
    const jobs = readJobs();
    const jobId = Date.now();
    const newJob = { id: jobId, ...job, channelName, date: jobTime.toISOString() };
    jobs.push(newJob);
    saveJobs(jobs);
    node_schedule_1.default.scheduleJob(jobId.toString(), jobTime, async () => {
        await (0, sendToTelegramChannel_1.sendToTelegramChannel)(job.productId, job.channelId);
        removeJob(jobId);
    });
    console.log(`[scheduler] job ${jobId} scheduled for ${jobTime.toISOString()}`);
}
function removeJob(jobId) {
    const idStr = jobId.toString();
    const scheduled = node_schedule_1.default.scheduledJobs[idStr];
    if (scheduled) {
        scheduled.cancel();
        console.log(`[scheduler] job ${idStr} cancelled`);
    }
    else {
        console.log(`[scheduler] no job found with id ${idStr}`);
    }
    const jobs = readJobs().filter((j) => j.id !== jobId);
    saveJobs(jobs);
    console.log(`[jobs.json] job ${idStr} removed from file`);
}
