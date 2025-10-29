"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToTelegramChannel = sendToTelegramChannel;
const __1 = require("..");
const downloadFileHandler_1 = require("../../handlers/downloadFileHandler");
const productFormatter_1 = require("../../handlers/productFormatter");
const wordpressService_1 = require("../../services/wordpressService");
async function sendToTelegramChannel(productId, channelKey) {
    const product = await (0, wordpressService_1.getProductById)(productId);
    if (!product)
        return console.error("❌ محصول پیدا نشد.");
    await (0, wordpressService_1.publishProduct)(productId);
    await (0, wordpressService_1.markAsSent)(productId);
    const formatted = (0, productFormatter_1.formatProduct)(product);
    const keyboard = { inline_keyboard: [[{ text: "دریافت از سایت ⬇️", url: `https://marigol.ir?p=${productId}` }]] };
    if (formatted.photoUrl) {
        await __1.bot.api.sendPhoto(channelKey, formatted.photoUrl, { caption: formatted.msg, parse_mode: "HTML", reply_markup: keyboard });
    }
    else {
        await __1.bot.api.sendMessage(channelKey, formatted.msg, { parse_mode: "HTML", reply_markup: keyboard });
    }
    if (formatted.fileUrl) {
        await (0, downloadFileHandler_1.sendProductFile)({ api: __1.bot.api }, formatted.fileUrl, String(formatted.productId), channelKey);
    }
    console.log(`✅ محصول ${productId} به ${channelKey} ارسال شد.`);
}
