import { Context, InputFile } from "grammy";
import path from "path";

export async function sendProductFile(ctx: Context, fileUrl: string, productId: string, targetId?: string) {
  if (!fileUrl) {
    await ctx.reply("🚫 لینک فایل یافت نشد.");
    return;
  }

  try {
    const ext = path.extname(new URL(fileUrl).pathname) || ".zip";
    const fileName = `${productId} - @marigol_ir${ext}`;

    const res = await fetch(fileUrl);
    if (!res.ok) throw new Error(`خطا در دانلود فایل: ${res.statusText}`);

    const contentLength = res.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 50 * 1024 * 1024) {
      await ctx.reply("⚠️ حجم فایل بیش از ۵۰ مگابایت است و قابل ارسال نیست");
      return;
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (buffer.byteLength > 50 * 1024 * 1024) {
      await ctx.reply("⚠️ حجم فایل بیش از ۵۰ مگابایت است و قابل ارسال نیست");
      return;
    }

    const file = new InputFile(buffer, fileName);

    if (targetId) {
      await ctx.api.sendDocument(targetId, file);
    } else {
      await ctx.replyWithDocument(file);
    }
  } catch (error) {
    console.error("❌ خطا در ارسال فایل:", error);
    await ctx.reply("❌ خطا در ارسال فایل این محصول.");
  }
}
