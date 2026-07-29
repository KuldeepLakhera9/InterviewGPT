export interface ResumeValidationResult {
  isValid: boolean;
  error?: string;
  detectedType?: 'pdf' | 'docx';
}

export const MAX_RESUME_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export const ALLOWED_EXTENSIONS = ['.pdf', '.docx'];

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
];

export function validateResumeFile(
  buffer: Buffer,
  fileName: string,
  declaredMimeType?: string
): ResumeValidationResult {
  // 1. Check file size
  if (!buffer || buffer.length === 0) {
    return { isValid: false, error: 'The uploaded file is empty.' };
  }

  if (buffer.length > MAX_RESUME_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `File size exceeds the 10MB limit (Actual: ${(buffer.length / (1024 * 1024)).toFixed(1)}MB).`,
    };
  }

  // 2. Check extension
  const ext = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      isValid: false,
      error: `Invalid file extension "${ext}". Only PDF and DOCX documents are accepted.`,
    };
  }

  // 3. Check declared MIME type if provided
  if (declaredMimeType && declaredMimeType.trim()) {
    const normMime = declaredMimeType.toLowerCase().trim();
    if (!ALLOWED_MIME_TYPES.includes(normMime) && normMime !== 'application/octet-stream') {
      return {
        isValid: false,
        error: `Unsupported MIME type "${declaredMimeType}". Only PDF and DOCX formats are allowed.`,
      };
    }
  }

  // 4. Magic-byte buffer validation
  // PDF Magic Bytes: %PDF- -> 0x25 0x50 0x44 0x46 0x2D
  const isPdfHeader =
    buffer.length >= 4 &&
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46;

  // DOCX Magic Bytes: PK\x03\x04 (Zip header) -> 0x50 0x4B 0x03 0x04
  const isDocxHeader =
    buffer.length >= 4 &&
    buffer[0] === 0x50 &&
    buffer[1] === 0x4b &&
    (buffer[2] === 0x03 || buffer[2] === 0x05 || buffer[2] === 0x07) &&
    (buffer[3] === 0x04 || buffer[3] === 0x06 || buffer[3] === 0x08);

  if (ext === '.pdf') {
    if (!isPdfHeader) {
      return {
        isValid: false,
        error: 'Security Check Failed: The file content does not match a valid PDF header (%PDF-).',
      };
    }
    return { isValid: true, detectedType: 'pdf' };
  }

  if (ext === '.docx') {
    if (!isDocxHeader) {
      return {
        isValid: false,
        error:
          'Security Check Failed: The file content does not match a valid DOCX package structure (PK magic bytes).',
      };
    }
    return { isValid: true, detectedType: 'docx' };
  }

  return { isValid: false, error: 'Unsupported file format.' };
}
