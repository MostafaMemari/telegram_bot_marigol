"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customChannelHandler = customChannelHandler;
const grammy_1 = require("grammy");
async function customChannelHandler(ctx) {
    const data = ctx.callbackQuery?.data;
    if (!data)
        return;
    await ctx.answerCallbackQuery();
    const [_, __, productId, channelId] = data.split("_");
    ctx.session.waitingForCustomTime = { productId, channelId };
    const keyboard = new grammy_1.InlineKeyboard().text("❌ لغو", `cancel_custom_time_${productId}`);
    await ctx.reply("⏰ لطفا زمان دلخواه خود را وارد کنید (مثلاً 10:45)", {
        reply_markup: keyboard,
    });
}
