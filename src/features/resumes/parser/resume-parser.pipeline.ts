import { extractRawTextFromBuffer } from './extractors/text-extractor';
import { cleanResumeText } from './cleaners/text-cleaner';
import {
  convertToStructuredJson,
  type ParsedResumeStructure,
} from './converters/structured-converter';
import {
  evaluateExtractionConfidence,
  type FieldConfidenceScores,
} from './evaluators/confidence-evaluator';

export interface ParsedResumePipelineResult {
  rawText: string;
  cleanedText: string;
  structuredData: ParsedResumeStructure;
  confidenceScores: FieldConfidenceScores;
  overallConfidence: number;
}

export async function parseResumePipeline(
  buffer: Buffer,
  fileName: string,
  declaredMimeType?: string
): Promise<ParsedResumePipelineResult> {
  // Stage 1 & 2: Extract text
  const rawText = await extractRawTextFromBuffer(buffer, fileName, declaredMimeType);

  // Stage 3: Clean text
  const cleanedText = cleanResumeText(rawText);

  // Stage 4: Convert to structured JSON
  const structuredData = convertToStructuredJson(cleanedText);

  // Stage 5: Evaluate confidence scores
  const confidenceResult = evaluateExtractionConfidence(structuredData, cleanedText.length);

  return {
    rawText,
    cleanedText,
    structuredData,
    confidenceScores: confidenceResult.scores,
    overallConfidence: confidenceResult.overallConfidence,
  };
}
