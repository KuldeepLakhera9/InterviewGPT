import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import type { IStorageService, StorageFilePayload, StoredFileContent } from './storage.interface';

export class LocalStorageProvider implements IStorageService {
  private uploadDir: string;

  constructor(uploadDir?: string) {
    this.uploadDir = uploadDir || path.join(process.cwd(), '.uploads', 'resumes');
  }

  private async ensureUploadDirExists(): Promise<void> {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
    } catch (err) {
      console.error('Failed to create upload directory:', err);
    }
  }

  async uploadFile(
    buffer: Buffer,
    fileName: string,
    mimeType: string
  ): Promise<StorageFilePayload> {
    await this.ensureUploadDirExists();

    const fileExtension =
      path.extname(fileName) || (mimeType === 'application/pdf' ? '.pdf' : '.docx');
    const safeBaseName = path.basename(fileName, fileExtension).replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileKey = `${Date.now()}_${crypto.randomBytes(6).toString('hex')}_${safeBaseName}${fileExtension}`;
    const filePath = path.join(this.uploadDir, fileKey);

    await fs.writeFile(filePath, buffer);

    const fileUrl = `/api/v1/resumes/file?key=${encodeURIComponent(fileKey)}`;

    return {
      fileKey,
      fileUrl,
      fileSize: buffer.length,
      mimeType,
    };
  }

  async deleteFile(fileKey: string): Promise<void> {
    const safeKey = path.basename(fileKey);
    const filePath = path.join(this.uploadDir, safeKey);
    try {
      await fs.unlink(filePath);
    } catch (err) {
      // File may already be removed or missing
      console.warn(`Could not delete storage file ${fileKey}:`, err);
    }
  }

  async getFile(fileKey: string): Promise<StoredFileContent | null> {
    const safeKey = path.basename(fileKey);
    const filePath = path.join(this.uploadDir, safeKey);
    try {
      const buffer = await fs.readFile(filePath);
      const isPdf = safeKey.endsWith('.pdf');
      const mimeType = isPdf
        ? 'application/pdf'
        : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

      return {
        buffer,
        mimeType,
        fileName: safeKey,
      };
    } catch (err) {
      console.error(`Failed to read stored file ${fileKey}:`, err);
      return null;
    }
  }
}
