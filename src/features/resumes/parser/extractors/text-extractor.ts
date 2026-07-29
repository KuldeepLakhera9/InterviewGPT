export async function extractRawTextFromBuffer(
  buffer: Buffer,
  fileName: string,
  _declaredMimeType?: string
): Promise<string> {
  if (!buffer || buffer.length === 0) {
    return '';
  }

  const ext = fileName.toLowerCase().slice(fileName.lastIndexOf('.'));

  if (ext === '.pdf') {
    return extractTextFromPdfBuffer(buffer);
  }

  if (ext === '.docx') {
    return extractTextFromDocxBuffer(buffer);
  }

  // Fallback utf8 text decoder
  return buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, ' ');
}

function extractTextFromPdfBuffer(buffer: Buffer): string {
  const contentStr = buffer.toString('latin1');
  const extractedLines: string[] = [];

  // Extract text inside Tj and TJ operators in PDF stream
  const tjRegex = /\(([^()]*)\)\s*Tj/g;
  let match: RegExpExecArray | null;

  while ((match = tjRegex.exec(contentStr)) !== null) {
    if (match[1] && match[1].trim()) {
      extractedLines.push(cleanPdfLiteral(match[1]));
    }
  }

  // Extract text inside TJ array operators: [(text) 10 (more)] TJ
  const arrayTjRegex = /\[\s*((?:\([^()]*\)\s*|-?\d+\s*)+)\]\s*TJ/g;
  while ((match = arrayTjRegex.exec(contentStr)) !== null) {
    const parts = match[1].match(/\([^()]*\)/g);
    if (parts) {
      const line = parts
        .map((p) => cleanPdfLiteral(p.slice(1, -1)))
        .join('')
        .trim();
      if (line) {
        extractedLines.push(line);
      }
    }
  }

  // Fallback: search plain text blocks if PDF operators weren't parsed
  if (extractedLines.length === 0) {
    const rawMatches = contentStr.match(/[\w\s\.,;:!?@#\$%\^&\*\(\)_\+=\-<>\\\/]{4,}/g);
    if (rawMatches) {
      return rawMatches
        .map((s) => s.trim())
        .filter((s) => s.length > 2 && !s.startsWith('/'))
        .join('\n');
    }
  }

  return extractedLines.join('\n');
}

function cleanPdfLiteral(literal: string): string {
  return literal
    .replace(/\\\( /g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '')
    .replace(/\\t/g, ' ')
    .replace(/\\/g, '');
}

function extractTextFromDocxBuffer(buffer: Buffer): string {
  const contentStr = buffer.toString('latin1');

  // DOCX files are ZIP archives containing word/document.xml
  // Extract text inside <w:t> tags
  const wtRegex = /<w:t[^>]*>([^<]+)<\/w:t>/g;
  const extractedText: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = wtRegex.exec(contentStr)) !== null) {
    if (match[1] && match[1].trim()) {
      extractedText.push(match[1]);
    }
  }

  if (extractedText.length > 0) {
    return extractedText.join(' ');
  }

  // Fallback readable string extraction
  const rawStrings = contentStr.match(/[A-Za-z0-9\s\.,;:!?@#\$%\^&\*\(\)_\+=\-<>\\\/]{3,}/g);
  return rawStrings ? rawStrings.filter((s) => s.trim().length > 2).join('\n') : '';
}
