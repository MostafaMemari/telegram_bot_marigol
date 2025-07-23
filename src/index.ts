import dotenv from "dotenv";
dotenv.config();

import http from "http";
import cron from "node-cron";
import { BotStatus } from "./monitor/status";
import { ApiService } from "./services/apiService";
import { TelegramService } from "./services/telegramService";
import { FileUtils } from "./utils/fileUtils";
import path from "path";

async function processFreeProducts(): Promise<void> {
  const runTime = new Date().toLocaleString("fa-IR");
  let successCount = 0;

  try {
    const products = await ApiService.getFreeProducts();

    if (products.length === 0) {
      console.log("❌ هیچ محصول رایگانی برای ارسال پیدا نشد.");
      BotStatus.lastRun = runTime;
      BotStatus.lastSuccessCount = 0;
      BotStatus.lastError = "";
      return;
    }

    for (const product of products) {
      const { id, fileData } = product;

      await TelegramService.sendPhoto(product);

      const maxFileSize = 50 * 1024 * 1024;
      for (const file of Object.values(fileData)) {
        if (!file.file) continue;

        const fileSize = await FileUtils.getFileSize(file.file);
        if (fileSize === false) continue;
        if (fileSize > maxFileSize) continue;

        const originalFileName = path.basename(file.file);
        const extension = path.extname(originalFileName);
        const newFileName = `${id} - @marigol_ir${extension}`;
        const tempFile = await FileUtils.downloadFile(file.file, newFileName);
        await TelegramService.sendDocument(tempFile, newFileName);
        FileUtils.deleteFile(tempFile);
      }

      await ApiService.markAsSent(id);
      console.log(`✅ محصول ${id} با موفقیت ارسال شد.`);
      successCount++;
    }

    BotStatus.lastRun = runTime;
    BotStatus.lastSuccessCount = successCount;
    BotStatus.lastError = "";
  } catch (err) {
    BotStatus.lastRun = runTime;
    BotStatus.lastSuccessCount = successCount;
    BotStatus.lastError = String(err);
    console.error("⛔ خطا در پردازش:", err);
  }
}

cron.schedule(process.env.CRON_SCHEDULE || "*/30 * * * *", () => {
  processFreeProducts();
});

processFreeProducts();

http
  .createServer((req, res) => {
    if (req.url === "/status") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(`
      <h2>📡 وضعیت ربات</h2>
      <p>🕒 آخرین اجرا: ${BotStatus.lastRun || "هنوز اجرا نشده"}</p>
      <p>✅ تعداد ارسال موفق: ${BotStatus.lastSuccessCount}</p>
      <p style="color:red;">❗ خطا: ${BotStatus.lastError || "ندارد"}</p>
    `);
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    }
  })
  .listen(3000, () => {
    console.log("📡 سرور مانیتور روی http://localhost:3000/status فعال است");
  });
