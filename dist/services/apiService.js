"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiService = void 0;
const axios_1 = __importDefault(require("axios"));
const API_BASE_URL = process.env.API_BASE_URL || "https://marigol.ir/api/api.php";
class ApiService {
    static async getFreeProducts() {
        try {
            const response = await axios_1.default.get(`${API_BASE_URL}/free-products`);
            if (response.data.status === "success") {
                return response.data.data;
            }
            throw new Error("Failed to fetch free products");
        }
        catch (error) {
            console.error("Error fetching free products:", error);
            throw error;
        }
    }
    static async markAsSent(postId) {
        try {
            const response = await axios_1.default.post(`${API_BASE_URL}/mark-as-sent`, { post_id: postId });
            if (response.data.status !== "success") {
                throw new Error("Failed to mark product as sent");
            }
        }
        catch (error) {
            console.error(`Error marking product ${postId} as sent:`, error);
            throw error;
        }
    }
    static async unmarkAsSent(postId) {
        try {
            const response = await axios_1.default.post(`${API_BASE_URL}/unmark-as-sent`, { post_id: postId });
            if (response.data.status === "success") {
                return response.data;
            }
            throw new Error("Failed to unmark product as sent");
        }
        catch (error) {
            console.error(`Error unmarking product ${postId} as sent:`, error);
            throw error;
        }
    }
}
exports.ApiService = ApiService;
