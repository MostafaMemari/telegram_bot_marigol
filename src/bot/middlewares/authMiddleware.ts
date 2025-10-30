import { Context, NextFunction } from "grammy";

const allowedUsers = ["Miro1992", "mostafa_memari"];
const allowedChannels = ["marigol_ir", "marigol_ar", "marigol_en", "sketchup_object_material"];

export async function authMiddleware(ctx: Context, next: NextFunction) {
  const fromUsername = ctx.from?.username;
  const chatUsername = ctx.chat?.username;

  const isUserAllowed = fromUsername && allowedUsers.includes(fromUsername);
  const isChannelAllowed = chatUsername && allowedChannels.includes(chatUsername);

  if (!isUserAllowed && !isChannelAllowed) {
    return await ctx.reply("🚫 شما دسترسی به این ربات ندارید.");
  }

  await next();
}
