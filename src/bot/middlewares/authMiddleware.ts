import { Context, NextFunction } from "grammy";

const allowedUsers = ["Miro1992", "mostafa_memari", "marigol_ir", "marigol_ar", "marigol_en", "sketchup_object_material"];

export async function authMiddleware(ctx: Context, next: NextFunction) {
  const username = ctx.from?.username;

  if (!username || !allowedUsers.includes(username)) return await ctx.reply("🚫 شما دسترسی به این ربات ندارید.");

  await next();
}
