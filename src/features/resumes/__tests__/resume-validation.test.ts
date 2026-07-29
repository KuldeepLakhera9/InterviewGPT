import { describe, expect, it } from 'vitest';
import { MAX_RESUME_FILE_SIZE_BYTES, validateResumeFile } from '../utils/resume-validator';
import { LocalStorageProvider } from '@/lib/storage/local-storage.provider';

describe('Resume Validation Utility', () => {
  it('should accept a valid PDF buffer with %PDF- header', () => {
    // PDF Magic Header: %PDF- (0x25 0x50 0x44 0x46 0x2D)
    const validPdfBuffer = Buffer.from([
      0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x35, 0x0a, 0x25, 0xd0, 0xd4,
    ]);

    const result = validateResumeFile(validPdfBuffer, 'resume.pdf', 'application/pdf');
    expect(result.isValid).toBe(true);
    expect(result.detectedType).toBe('pdf');
  });

  it('should accept a valid DOCX buffer with PK header', () => {
    // DOCX Zip Magic Header: PK\x03\x04 (0x50 0x4B 0x03 0x04)
    const validDocxBuffer = Buffer.from([
      0x50, 0x4b, 0x03, 0x04, 0x14, 0x00, 0x06, 0x00, 0x08, 0x00,
    ]);

    const result = validateResumeFile(
      validDocxBuffer,
      'my_resume.docx',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    expect(result.isValid).toBe(true);
    expect(result.detectedType).toBe('docx');
  });

  it('should reject a spoofed PDF file missing %PDF- magic bytes', () => {
    const fakeBuffer = Buffer.from('THIS_IS_NOT_A_REAL_PDF_FILE');
    const result = validateResumeFile(fakeBuffer, 'malicious.pdf', 'application/pdf');

    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Security Check Failed');
  });

  it('should reject unapproved file extensions like .txt or .exe', () => {
    const buffer = Buffer.from('hello world');
    const result = validateResumeFile(buffer, 'script.exe');

    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Invalid file extension');
  });

  it('should reject files exceeding 10MB', () => {
    const largeBuffer = Buffer.alloc(MAX_RESUME_FILE_SIZE_BYTES + 1024);
    const result = validateResumeFile(largeBuffer, 'large_resume.pdf');

    expect(result.isValid).toBe(false);
    expect(result.error).toContain('exceeds the 10MB limit');
  });
});

describe('LocalStorageProvider', () => {
  it('should generate file payload and read stored content', async () => {
    const provider = new LocalStorageProvider();
    const pdfBuffer = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34]);

    const payload = await provider.uploadFile(pdfBuffer, 'unit_test_resume.pdf', 'application/pdf');
    expect(payload.fileKey).toBeDefined();
    expect(payload.fileSize).toBe(pdfBuffer.length);

    const retrieved = await provider.getFile(payload.fileKey);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.buffer.length).toBe(pdfBuffer.length);

    await provider.deleteFile(payload.fileKey);
  });
});
