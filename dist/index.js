"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const http_1 = __importDefault(require("http"));
const node_cron_1 = __importDefault(require("node-cron"));
const status_1 = require("./monitor/status");
const apiService_1 = require("./services/apiService");
const telegramService_1 = require("./services/telegramService");
const fileUtils_1 = require("./utils/fileUtils");
const path_1 = __importDefault(require("path"));
async function processFreeProducts() {
    const runTime = new Date().toLocaleString("fa-IR");
    let successCount = 0;
    try {
        const products = await apiService_1.ApiService.getFreeProducts();
        if (products.length === 0) {
            console.log("❌ هیچ محصول رایگانی برای ارسال پیدا نشد.");
            status_1.BotStatus.lastRun = runTime;
            status_1.BotStatus.lastSuccessCount = 0;
            status_1.BotStatus.lastError = "";
            return;
        }
        for (const product of products) {
            const { id, fileData } = product;
            await telegramService_1.TelegramService.sendPhoto(product);
            const maxFileSize = 50 * 1024 * 1024;
            for (const file of Object.values(fileData)) {
                if (!file.file)
                    continue;
                const fileSize = await fileUtils_1.FileUtils.getFileSize(file.file);
                if (fileSize === false)
                    continue;
                if (fileSize > maxFileSize)
                    continue;
                const originalFileName = path_1.default.basename(file.file);
                const extension = path_1.default.extname(originalFileName);
                const newFileName = `${id} - @marigol_ir${extension}`;
                const tempFile = await fileUtils_1.FileUtils.downloadFile(file.file, newFileName);
                await telegramService_1.TelegramService.sendDocument(tempFile, newFileName);
                fileUtils_1.FileUtils.deleteFile(tempFile);
            }
            await apiService_1.ApiService.markAsSent(id);
            console.log(`✅ محصول ${id} با موفقیت ارسال شد.`);
            successCount++;
        }
        status_1.BotStatus.lastRun = runTime;
        status_1.BotStatus.lastSuccessCount = successCount;
        status_1.BotStatus.lastError = "";
    }
    catch (err) {
        status_1.BotStatus.lastRun = runTime;
        status_1.BotStatus.lastSuccessCount = successCount;
        status_1.BotStatus.lastError = String(err);
        console.error("⛔ خطا در پردازش:", err);
    }
}
node_cron_1.default.schedule(process.env.CRON_SCHEDULE || "*/30 * * * *", () => {
    processFreeProducts();
});
processFreeProducts();
http_1.default
    .createServer((req, res) => {
    if (req.url === "/status") {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(`
      <h2>📡 وضعیت ربات</h2>
      <p>🕒 آخرین اجرا: ${status_1.BotStatus.lastRun || "هنوز اجرا نشده"}</p>
      <p>✅ تعداد ارسال موفق: ${status_1.BotStatus.lastSuccessCount}</p>
      <p style="color:red;">❗ خطا: ${status_1.BotStatus.lastError || "ندارد"}</p>
    `);
    }
    else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
    }
})
    .listen(3000, () => {
    console.log("📡 سرور مانیتور روی http://localhost:3000/status فعال است");
});
