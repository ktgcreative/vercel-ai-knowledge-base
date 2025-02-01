'use server';

import { generateText, LanguageModelV1 } from 'ai';
import { createDeepSeek } from '@ai-sdk/deepseek';

if (!process.env.DEEPSEEK_API_KEY) {
    throw new Error('Missing DEEPSEEK_API_KEY environment variable');
}

// Create DeepSeek instance with API key
const deepseekInstance = createDeepSeek({
    apiKey: process.env.DEEPSEEK_API_KEY
});

export interface DeepseekCallOptions {
    model?: string;
    maxSteps?: number;
    prompt: string;
}

// callDeepseek wraps the Vercel AI generateText call for DeepSeek with standardized logging & error handling.
export async function callDeepseek(options: DeepseekCallOptions) {
    const model = deepseekInstance(options.model ?? 'deepseek-chat') as LanguageModelV1;
    console.log('💡 Starting DeepSeek call with options:', options);

    try {
        const result = await generateText({
            model,
            maxSteps: options.maxSteps ?? 5,
            prompt: options.prompt,
        });

        // Log cache metrics if available
        if (result.experimental_providerMetadata?.deepseek) {
            console.log('📊 DeepSeek cache metrics:', {
                hitTokens: result.experimental_providerMetadata.deepseek.promptCacheHitTokens,
                missTokens: result.experimental_providerMetadata.deepseek.promptCacheMissTokens
            });
        }

        console.log('✅ DeepSeek call successful:', result);
        return result;
    } catch (error) {
        console.error('❌ DeepSeek call failed:', error);
        throw error;
    }
} 