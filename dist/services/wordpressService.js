"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = getProducts;
exports.getProductById = getProductById;
exports.getAllProducts = getAllProducts;
exports.publishProduct = publishProduct;
exports.markAsSent = markAsSent;
exports.unmarkAsSent = unmarkAsSent;
const config_1 = require("../config");
// دریافت محصولات در حالت پیش‌نویس
async function getProducts() {
    const res = await fetch("https://marigol.ir/api/api.php/draft-free-products", {});
    if (!res.ok)
        throw new Error(`HTTP error! status: ${res.status}`);
    const response = await res.json();
    if (response.status !== "success")
        throw new Error("API returned unsuccessful status");
    return response.data;
}
async function getProductById(id) {
    const res = await fetch(`https://marigol.ir/api/api.php/product/${id}`);
    if (!res.ok)
        throw new Error(`HTTP error! status: ${res.status}`);
    const response = await res.json();
    if (response.status !== "success")
        throw new Error("API returned unsuccessful status");
    return response.data;
}
async function getAllProducts(page = 1) {
    const res = await fetch(`https://marigol.ir/api/api.php/all-products?page=${page}`);
    if (!res.ok)
        throw new Error(`HTTP error! status: ${res.status}`);
    const response = await res.json();
    if (response.status !== "success")
        throw new Error("API returned unsuccessful status");
    return {
        data: response.data,
        page: response.pagination?.current_page || page,
        total_pages: response.pagination?.total_pages || 1,
    };
}
async function publishProduct(productId) {
    const auth = Buffer.from(`${config_1.WP_USER}:${config_1.WP_APP_PASSWORD}`).toString("base64");
    try {
        const res = await fetch(`https://marigol.ir/wp-json/wp/v2/downloads/${productId}`, {
            method: "POST",
            headers: {
                Authorization: "Basic " + auth,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: "publish" }),
        });
        if (!res.ok) {
            console.error("❌ خطا در انتشار محصول:", res.status, await res.text());
            return false;
        }
        const data = await res.json();
        console.log("✅ محصول منتشر شد:", data);
        return true;
    }
    catch (err) {
        console.error("🚨 خطای ارتباط با سرور:", err);
        return false;
    }
}
async function markAsSent(postId) {
    try {
        const res = await fetch("https://marigol.ir/api/api.php/mark-as-sent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ post_id: postId }),
        });
        const data = await res.json();
        if (!res.ok || data.error) {
            console.error("❌ خطا در ثبت وضعیت ارسال:", data.error || res.status);
            return false;
        }
        console.log("✅ محصول به عنوان ارسال‌شده ثبت شد:", data);
        return true;
    }
    catch (err) {
        console.error("🚨 خطا در ارتباط با سرور:", err);
        return false;
    }
}
async function unmarkAsSent(postId) {
    try {
        const res = await fetch("https://marigol.ir/api/api.php/unmark-as-sent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ post_id: postId }),
        });
        const data = await res.json();
        if (!res.ok || data.error) {
            console.error("❌ خطا در حذف وضعیت ارسال:", data.error || res.status);
            return false;
        }
        console.log("✅ وضعیت ارسال محصول حذف شد:", data);
        return true;
    }
    catch (err) {
        console.error("🚨 خطا در ارتباط با سرور:", err);
        return false;
    }
}
