"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUtils = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class FileUtils {
    static async getFileSize(fileUrl) {
        try {
            const response = await axios_1.default.head(fileUrl);
            return parseInt(response.headers["content-length"]) || false;
        }
        catch (error) {
            console.error(`Error getting file size for ${fileUrl}:`, error);
            return false;
        }
    }
    static async downloadFile(fileUrl, fileName) {
        const tmpDir = path_1.default.join(__dirname, "..", "tmp");
        if (!fs_1.default.existsSync(tmpDir)) {
            fs_1.default.mkdirSync(tmpDir, { recursive: true });
        }
        const tempFile = path_1.default.join(tmpDir, fileName);
        try {
            const response = await axios_1.default.get(fileUrl, { responseType: "stream" });
            const writer = fs_1.default.createWriteStream(tempFile);
            return new Promise((resolve, reject) => {
                response.data.pipe(writer);
                writer.on("finish", () => resolve(tempFile));
                writer.on("error", (error) => reject(error));
            });
        }
        catch (error) {
            console.error(`Error downloading file ${fileName}:`, error);
            throw error;
        }
    }
    static deleteFile(filePath) {
        try {
            fs_1.default.unlinkSync(filePath);
        }
        catch (error) {
            console.error(`Error deleting file ${filePath}:`, error);
        }
    }
}
exports.FileUtils = FileUtils;
