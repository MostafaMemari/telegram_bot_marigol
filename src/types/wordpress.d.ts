export interface Product {
  id: string;
  postTitle: string;
  guid: string;
  fileData: {
    [key: string]: {
      index: string;
      attachment_id: string;
      thumbnail_size: string;
      name: string;
      file: string;
      condition: string;
    };
  };
  mainImage: string;
  tags: string[];
  categories: string[];
  sentToTelegram: boolean;
}

interface FileDataItem {
  index?: string;
  attachment_id?: string;
  thumbnail_size?: string;
  name?: string;
  file?: string;
  condition?: string;
}
