"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const allowedUsers = ["Miro1992", "mostafa_memari"];
async function authMiddleware(ctx, next) {
    const username = ctx.from?.username;
    if (!username || !allowedUsers.includes(username))
        return await ctx.reply("🚫 شما دسترسی به این ربات ندارید.");
    await next();
}
