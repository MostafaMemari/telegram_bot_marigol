"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const apiService_1 = require("./services/apiService");
const telegramService_1 = require("./services/telegramService");
const fileUtils_1 = require("./utils/fileUtils");
const path_1 = __importDefault(require("path"));
const node_cron_1 = __importDefault(require("node-cron"));
async function processFreeProducts() {
  try {
    const products = await apiService_1.ApiService.getFreeProducts();
    if (products.length === 0) {
      console.log("❌ هیچ محصول رایگانی برای ارسال پیدا نشد.");
      return;
    }
    for (const product of products) {
      const { id, fileData } = product;
      await telegramService_1.TelegramService.sendPhoto(product);
      const maxFileSize = 50 * 1024 * 1024;
      for (const file of Object.values(fileData)) {
        if (!file.file) continue;
        const fileSize = await fileUtils_1.FileUtils.getFileSize(file.file);
        if (fileSize === false) {
          console.error(`خطا در دریافت اندازه فایل: ${file.file}`);
          continue;
        }
        if (fileSize > maxFileSize) {
          console.error(`فایل بزرگ‌تر از 50 مگابایت است و باید دستی ارسال شود: ${file.file}`);
          continue;
        }
        const originalFileName = path_1.default.basename(file.file);
        const extension = path_1.default.extname(originalFileName);
        const newFileName = `${id} - @marigol_ir${extension}`;
        const tempFile = await fileUtils_1.FileUtils.downloadFile(file.file, newFileName);
        await telegramService_1.TelegramService.sendDocument(tempFile, newFileName);
        fileUtils_1.FileUtils.deleteFile(tempFile);
      }
      await apiService_1.ApiService.markAsSent(id);
      console.log(`✅ محصول ${id} با موفقیت ارسال و ثبت شد.`);
    }
  } catch (error) {
    console.error("خطا در پردازش محصولات:", error);
  }
}
node_cron_1.default.schedule("*/30 * * * *", () => {
  processFreeProducts();
});
processFreeProducts();
