export class ApiClient {
  baseUrl: string;
  constructor();
  fetchFromDb(url: string): Promise<any>;
  get<T = any>(endpoint: string): Promise<T>;
  post<T = any>(endpoint: string, data?: any): Promise<T>;
  put<T = any>(endpoint: string, data?: any): Promise<T>;
  delete<T = any>(endpoint: string): Promise<T>;
}

export const apiClient: ApiClient; 