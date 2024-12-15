export type ApiResponse<T> = {
  data?: T;
  error?: any;
  message?: string;
  statusCode: number;
};

export type InfoApiResponse = {
  name: string,
  version: string,
  description: string,
  license: string,
  author: string,
  homepage: string,
  licensePage: string
};

export type IpApiResponse = {
  ip: string;
};

export type FilesApiResponse = {
  files: string[]
}

export type FileUploadApiResponse = {
  message: string,
  uploadedFileName: string,
  error?: any
}