'use server';

import { extractAndTranslateWords } from '@/ai/flows';
import { AnalysisResult } from '@/lib/types';

export async function analyzeImage(photoDataUri: string): Promise<{ data: AnalysisResult | null; error: string | null; }> {
  if (!photoDataUri) {
    return { data: null, error: 'No image data provided.' };
  }
  try {
    const result = await extractAndTranslateWords({ photoDataUri });
    if (!result || !result.words || result.words.length === 0) {
      return { data: null, error: "No Chinese characters were found in the image. Please try another one."};
    }
    return { data: result, error: null };
  } catch (e: any) {
    console.error(e);
    return { data: null, error: e.message || 'An unknown error occurred during analysis.' };
  }
}
