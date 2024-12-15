export type ApiResponse<T> = {
  data?: T;
  error?: any;
  message?: string;
  statusCode: number;
};