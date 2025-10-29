import { MyContext } from "../../api/bot";

export async function cancelCustomTimeHandler(ctx: MyContext) {
  if (!ctx.callbackQuery?.data) return;

  ctx.session.waitingForCustomTime = undefined;

  await ctx.answerCallbackQuery();

  await ctx.reply("❌ وارد کردن زمان‌بندی لغو شد.");
}
