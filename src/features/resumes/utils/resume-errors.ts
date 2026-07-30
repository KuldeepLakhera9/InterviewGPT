export type ResumeErrorCode =
  | 'INVALID_FILE_HEADER'
  | 'FILE_SIZE_EXCEEDED'
  | 'UNSUPPORTED_MIME_TYPE'
  | 'PARSING_PIPELINE_ERROR'
  | 'LLM_API_TIMEOUT'
  | 'RAG_CONTEXT_UNAVAILABLE'
  | 'UNAUTHORIZED_ACCESS'
  | 'RESUME_NOT_FOUND';

export class ResumeError extends Error {
  public readonly code: ResumeErrorCode;
  public readonly statusCode: number;

  constructor(message: string, code: ResumeErrorCode, statusCode: number = 400) {
    super(message);
    this.name = 'ResumeError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export function isResumeError(error: unknown): error is ResumeError {
  return error instanceof ResumeError;
}

export function formatErrorMessage(error: unknown): string {
  if (isResumeError(error)) {
    return `[${error.code}] ${error.message}`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected Resume Intelligence error occurred.';
}
