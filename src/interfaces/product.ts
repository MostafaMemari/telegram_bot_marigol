export interface Product {
  id: number;
  postTitle: string;
  guid: string;
  fileData: fileData[];
  mainImage: string;
  tags: string[];
  categories: string[];
}

export interface fileData {
  index: string;
  attachment_id: string;
  thumbnail_size: string;
  name: string;
  file: string;
  condition: string;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
}

export interface UnmarkResponse {
  status: string;
  message: string;
}
