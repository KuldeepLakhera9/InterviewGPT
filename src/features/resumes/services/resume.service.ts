import { prisma } from '@/lib/prisma';
import { getStorageService, type IStorageService } from '@/lib/storage';
import type { ResumeItem } from '../types/resume.types';
import { validateResumeFile } from '../utils/resume-validator';

export class ResumeService {
  private storage: IStorageService;

  constructor(storageService?: IStorageService) {
    this.storage = storageService || getStorageService();
  }

  async getUserResumes(userId: string): Promise<ResumeItem[]> {
    const records = await prisma.resume.findMany({
      where: { userId },
      orderBy: { version: 'desc' },
    });

    return records.map((r) => ({
      id: r.id,
      workspaceId: r.workspaceId,
      userId: r.userId,
      fileName: r.fileName,
      fileUrl: r.fileUrl,
      fileKey: r.fileKey,
      fileSize: r.fileSize,
      mimeType: r.mimeType,
      version: r.version,
      isActive: r.isActive,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));
  }

  async uploadResume(
    userId: string,
    workspaceId: string,
    buffer: Buffer,
    fileName: string,
    declaredMimeType?: string
  ): Promise<ResumeItem> {
    // 1. Validate file securely
    const validation = validateResumeFile(buffer, fileName, declaredMimeType);
    if (!validation.isValid) {
      throw new Error(validation.error || 'File validation failed.');
    }

    const mimeType =
      validation.detectedType === 'pdf'
        ? 'application/pdf'
        : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    // 2. Compute next version number
    const latestResume = await prisma.resume.findFirst({
      where: { userId },
      orderBy: { version: 'desc' },
    });
    const nextVersion = latestResume ? latestResume.version + 1 : 1;

    // 3. Mark existing resumes as inactive
    await prisma.resume.updateMany({
      where: { userId, isActive: true },
      data: { isActive: false },
    });

    // 4. Upload file to decoupled storage service
    const storedFile = await this.storage.uploadFile(buffer, fileName, mimeType);

    // 5. Create database record
    const created = await prisma.resume.create({
      data: {
        userId,
        workspaceId,
        fileName,
        fileUrl: storedFile.fileUrl,
        fileKey: storedFile.fileKey,
        fileSize: storedFile.fileSize,
        mimeType: storedFile.mimeType,
        version: nextVersion,
        isActive: true,
      },
    });

    return {
      id: created.id,
      workspaceId: created.workspaceId,
      userId: created.userId,
      fileName: created.fileName,
      fileUrl: created.fileUrl,
      fileKey: created.fileKey,
      fileSize: created.fileSize,
      mimeType: created.mimeType,
      version: created.version,
      isActive: created.isActive,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    };
  }

  async replaceResume(
    userId: string,
    workspaceId: string,
    existingResumeId: string,
    buffer: Buffer,
    fileName: string,
    declaredMimeType?: string
  ): Promise<ResumeItem> {
    const existing = await prisma.resume.findUnique({
      where: { id: existingResumeId },
    });

    if (!existing || existing.userId !== userId) {
      throw new Error('Existing resume record not found or access denied.');
    }

    // Replace behaves as uploading a new active version
    return this.uploadResume(userId, workspaceId, buffer, fileName, declaredMimeType);
  }

  async setActiveVersion(userId: string, resumeId: string): Promise<void> {
    const target = await prisma.resume.findUnique({
      where: { id: resumeId },
    });

    if (!target || target.userId !== userId) {
      throw new Error('Resume not found or unauthorized.');
    }

    await prisma.$transaction([
      prisma.resume.updateMany({
        where: { userId, isActive: true },
        data: { isActive: false },
      }),
      prisma.resume.update({
        where: { id: resumeId },
        data: { isActive: true },
      }),
    ]);
  }

  async deleteResume(userId: string, resumeId: string): Promise<void> {
    const target = await prisma.resume.findUnique({
      where: { id: resumeId },
    });

    if (!target || target.userId !== userId) {
      throw new Error('Resume record not found or unauthorized.');
    }

    // 1. Delete file from storage service
    await this.storage.deleteFile(target.fileKey);

    // 2. Delete database record
    await prisma.resume.delete({
      where: { id: resumeId },
    });

    // 3. If target was active, promote latest remaining version
    if (target.isActive) {
      const latestRemaining = await prisma.resume.findFirst({
        where: { userId },
        orderBy: { version: 'desc' },
      });

      if (latestRemaining) {
        await prisma.resume.update({
          where: { id: latestRemaining.id },
          data: { isActive: true },
        });
      }
    }
  }

  async getResumeFileBuffer(
    userId: string,
    resumeId: string
  ): Promise<{ buffer: Buffer; mimeType: string; fileName: string }> {
    const target = await prisma.resume.findUnique({
      where: { id: resumeId },
    });

    if (!target || target.userId !== userId) {
      throw new Error('Resume record not found.');
    }

    const fileContent = await this.storage.getFile(target.fileKey);
    if (!fileContent) {
      throw new Error('File content could not be retrieved from storage.');
    }

    return {
      buffer: fileContent.buffer,
      mimeType: target.mimeType,
      fileName: target.fileName,
    };
  }
}

export const resumeService = new ResumeService();
