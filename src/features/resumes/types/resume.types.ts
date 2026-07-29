export interface ResumeItem {
  id: string;
  workspaceId: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  fileKey: string;
  fileSize: number;
  mimeType: string;
  version: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeActionResult {
  success: boolean;
  message?: string;
  error?: string;
  resume?: ResumeItem;
  resumes?: ResumeItem[];
}

export interface ResumeUploadProgress {
  status: 'idle' | 'validating' | 'uploading' | 'completed' | 'error';
  progress: number;
  fileName?: string;
  error?: string;
}
