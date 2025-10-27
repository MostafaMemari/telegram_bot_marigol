import { Context, InlineKeyboard } from "grammy";
import { getProducts } from "../../services/wordpressService";

export async function draftsHandler(ctx: Context) {
  if (ctx.callbackQuery) await ctx.answerCallbackQuery();

  try {
    const drafts = await getProducts();
    if (!drafts || drafts.length === 0) {
      await ctx.reply("هیچ محصول پیش‌نویسی وجود ندارد.");
      return;
    }

    for (const p of drafts) {
      const keyboard = new InlineKeyboard().text("🟢 انتشار محصول", `select_time_${p.id}`);
      const msg = `📌 ${p.postTitle}\n 🔑 شناسه محصول : ${p.id}`;

      if (p.mainImage) {
        await ctx.replyWithPhoto(p.mainImage, { caption: msg, parse_mode: "HTML", reply_markup: keyboard });
      } else {
        await ctx.reply(msg, { parse_mode: "HTML", reply_markup: keyboard });
      }
    }
  } catch (err) {
    console.error(err);
    await ctx.reply("خطا در دریافت پیش‌نویس‌ها.");
  }
}
