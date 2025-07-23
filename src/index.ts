import dotenv from "dotenv";
dotenv.config();

import { ApiService } from "./services/apiService";
import { TelegramService } from "./services/telegramService";
import { FileUtils } from "./utils/fileUtils";
import path from "path";
import cron from "node-cron";

async function processFreeProducts(): Promise<void> {
  try {
    const products = await ApiService.getFreeProducts();

    if (products.length === 0) {
      console.log("❌ هیچ محصول رایگانی برای ارسال پیدا نشد.");
      return;
    }

    for (const product of products) {
      const { id, fileData } = product;
      await TelegramService.sendPhoto(product);

      const maxFileSize = 50 * 1024 * 1024;
      for (const file of Object.values(fileData)) {
        if (!file.file) continue;

        const fileSize = await FileUtils.getFileSize(file.file);
        if (fileSize === false) {
          console.error(`خطا در دریافت اندازه فایل: ${file.file}`);
          continue;
        }

        if (fileSize > maxFileSize) {
          console.error(`فایل بزرگ‌تر از 50 مگابایت است و باید دستی ارسال شود: ${file.file}`);
          continue;
        }

        const originalFileName = path.basename(file.file);
        const extension = path.extname(originalFileName);
        const newFileName = `${id} - @marigol_ir${extension}`;
        const tempFile = await FileUtils.downloadFile(file.file, newFileName);
        await TelegramService.sendDocument(tempFile, newFileName);
        FileUtils.deleteFile(tempFile);
      }

      await ApiService.markAsSent(id);
      console.log(`✅ محصول ${id} با موفقیت ارسال و ثبت شد.`);
    }
  } catch (error) {
    console.error("خطا در پردازش محصولات:", error);
  }
}

cron.schedule("*/30 * * * *", () => {
  processFreeProducts();
});

processFreeProducts();
