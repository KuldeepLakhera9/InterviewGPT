export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type ApiResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
        details?: unknown;
      };
    };
