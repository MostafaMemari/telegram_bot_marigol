import axios from "axios";
import { Product, ApiResponse, UnmarkResponse } from "../interfaces/product";

const API_BASE_URL = process.env.API_BASE_URL || "https://marigol.ir/api/api.php";

export class ApiService {
  static async getFreeProducts(): Promise<Product[]> {
    try {
      const response = await axios.get<ApiResponse<Product[]>>(`${API_BASE_URL}/free-products`);
      if (response.data.status === "success") {
        return response.data.data;
      }
      throw new Error("Failed to fetch free products");
    } catch (error) {
      console.error("Error fetching free products:", error);
      throw error;
    }
  }

  static async markAsSent(postId: number): Promise<void> {
    try {
      const response = await axios.post<ApiResponse<void>>(`${API_BASE_URL}/mark-as-sent`, { post_id: postId });
      if (response.data.status !== "success") {
        throw new Error("Failed to mark product as sent");
      }
    } catch (error) {
      console.error(`Error marking product ${postId} as sent:`, error);
      throw error;
    }
  }

  static async unmarkAsSent(postId: number): Promise<UnmarkResponse> {
    try {
      const response = await axios.post<UnmarkResponse>(`${API_BASE_URL}/unmark-as-sent`, { post_id: postId });
      if (response.data.status === "success") {
        return response.data;
      }
      throw new Error("Failed to unmark product as sent");
    } catch (error) {
      console.error(`Error unmarking product ${postId} as sent:`, error);
      throw error;
    }
  }
}
