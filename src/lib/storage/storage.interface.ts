export interface StorageFilePayload {
  fileKey: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}

export interface StoredFileContent {
  buffer: Buffer;
  mimeType: string;
  fileName: string;
}

export interface IStorageService {
  uploadFile(buffer: Buffer, fileName: string, mimeType: string): Promise<StorageFilePayload>;
  deleteFile(fileKey: string): Promise<void>;
  getFile(fileKey: string): Promise<StoredFileContent | null>;
}
