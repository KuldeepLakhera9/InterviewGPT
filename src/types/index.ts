export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
  metadata?: {
    timestamp: string;
    requestId?: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface AsyncState<T> {
  data: Nullable<T>;
  isLoading: boolean;
  error: Nullable<string>;
}
