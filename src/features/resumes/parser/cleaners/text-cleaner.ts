export function cleanResumeText(rawText: string): string {
  if (!rawText) return '';

  let cleaned = rawText;

  // 1. Strip non-printable control characters (except newline, carriage return, tab)
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // 2. Replace weird Unicode / garbled bullet characters with standard dash
  cleaned = cleaned.replace(/[•▪●✦❖►■✓✔➢➢\u2022\u2023\u2043\u204C\u204D\u2219]/g, '- ');

  // 3. Fix common encoding artifacts (e.g. â€¢ -> -)
  cleaned = cleaned.replace(/â€¢/g, '- ');

  // 4. Normalize multiple spaces into single space per line
  const lines = cleaned.split('\n');
  const sanitizedLines = lines.map((line) => {
    const trimmed = line.replace(/[ \t]+/g, ' ').trim();
    return trimmed;
  });

  // 5. Remove excessive consecutive blank lines (allow at most 1 blank line between sections)
  const resultLines: string[] = [];
  let blankCount = 0;

  for (const line of sanitizedLines) {
    if (line === '') {
      blankCount++;
      if (blankCount <= 1) {
        resultLines.push('');
      }
    } else {
      blankCount = 0;
      resultLines.push(line);
    }
  }

  return resultLines.join('\n').trim();
}
