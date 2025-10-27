export interface FormattedProduct {
  msg: string;
  fileUrl?: string;
  photoUrl?: string;
  productId: number;
}

export function formatProduct(p: any): FormattedProduct {
  const allTags = [...(p.categories || []), ...(p.tags || [])].map((t: string) => `#${t.trim().replace(/\s+/g, "_")}`).join(" ");

  let msg = `📌 <b>${p.postTitle}</b>\n\n`;

  if (allTags.trim()) {
    msg += `🏷️ <b>تگ‌ها:</b> ${allTags}\n\n`;
  }

  msg +=
    `🌐 <b><a href="https://marigol.ir">وبسایت ما</a></b>\n` +
    `📸 <b><a href="https://www.instagram.com/sketchup_marigol">اینستاگرام ما</a></b>\n` +
    `📢 <b>@marigol_ir | ماری‌گل</b>`;

  return {
    msg,
    photoUrl: p.mainImage,
    fileUrl: p.fileData?.[1]?.file || undefined,
    productId: Number(p.id),
  };
}
