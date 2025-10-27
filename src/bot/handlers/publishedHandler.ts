import { Context, InlineKeyboard } from "grammy";
import { getAllProducts } from "../../services/wordpressService";

export async function publishedHandler(ctx: Context) {
  if (ctx.callbackQuery) await ctx.answerCallbackQuery();

  let page = 1;
  if (ctx.callbackQuery?.data?.startsWith("published_page_")) {
    page = parseInt(ctx.callbackQuery.data.split("_")[2], 10);
  }

  try {
    const response = await getAllProducts(page);
    const { data: products, page: current_page, total_pages } = response;

    if (!products || products.length === 0) return await ctx.reply("❌ هیچ محصولی برای نمایش وجود ندارد.");

    const keyboard = new InlineKeyboard();

    for (const p of products) {
      const words = p.postTitle.split(" ");
      const shortTitle = words.slice(0, 5).join(" ") + (words.length > 5 ? "..." : "");
      keyboard.text(`${p.sentToTelegram ? "✅" : "❌"} ${p.id} - ${shortTitle}`, `product_${p.id}`).row();
    }

    if (total_pages > 1) {
      if (current_page > 1) keyboard.text("➡️ صفحه قبل", `published_page_${current_page - 1}`);
      if (current_page < total_pages) keyboard.text("صفحه بعد ⬅️", `published_page_${current_page + 1}`);
      keyboard.row();
    }

    const messageText = `🟢 <b>لیست محصولات منتشرشده</b>\n📄 صفحه ${current_page} از ${total_pages}`;

    if (ctx.callbackQuery?.message) {
      const msg = ctx.callbackQuery.message;

      if ("text" in msg && msg.text) {
        await ctx.api.editMessageText(msg.chat.id, msg.message_id, messageText, { parse_mode: "HTML", reply_markup: keyboard });
      } else {
        await ctx.reply(messageText, { parse_mode: "HTML", reply_markup: keyboard });
      }
    } else {
      await ctx.reply(messageText, {
        parse_mode: "HTML",
        reply_markup: keyboard,
      });
    }
  } catch (err) {
    console.error("❌ خطا در دریافت محصولات:", err);
    await ctx.reply("🚫 خطا در دریافت اطلاعات محصولات منتشرشده.");
  }
}
