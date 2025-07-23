import axios from "axios";
import fs from "fs";
import path from "path";
import { WriteStream } from "fs";

export class FileUtils {
  static async getFileSize(fileUrl: string): Promise<number | false> {
    try {
      const response = await axios.head(fileUrl);
      return parseInt(response.headers["content-length"]) || false;
    } catch (error) {
      console.error(`Error getting file size for ${fileUrl}:`, error);
      return false;
    }
  }

  static async downloadFile(fileUrl: string, fileName: string): Promise<string> {
    const tmpDir = path.join(__dirname, "..", "tmp");

    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    const tempFile = path.join(tmpDir, fileName);

    try {
      const response = await axios.get(fileUrl, { responseType: "stream" });
      const writer: WriteStream = fs.createWriteStream(tempFile);

      return new Promise<string>((resolve, reject) => {
        response.data.pipe(writer);
        writer.on("finish", () => resolve(tempFile));
        writer.on("error", (error: Error) => reject(error));
      });
    } catch (error) {
      console.error(`Error downloading file ${fileName}:`, error);
      throw error;
    }
  }

  static deleteFile(filePath: string): void {
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
    }
  }
}
