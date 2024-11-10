export interface ApiResponse {
  statusCode: number;
  data: any;
  message: string;
  errors: any; // You can specify a more specific type if you know its structure
}
