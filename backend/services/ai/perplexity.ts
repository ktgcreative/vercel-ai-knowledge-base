// /backend/lib/ai/perplexity-call.ts
'use server';

import { generateText, LanguageModelV1 } from 'ai';
import { createPerplexity } from '@ai-sdk/perplexity';

if (!process.env.PERPLEXITY_API_KEY) {
    throw new Error('Missing PERPLEXITY_API_KEY environment variable');
}

// Create Perplexity instance with API key
const perplexityInstance = createPerplexity({
    apiKey: process.env.PERPLEXITY_API_KEY
});

export interface PerplexityCallOptions {
    model?: string;
    maxSteps?: number;
    prompt: string;
}

// callPerplexity wraps the Vercel AI generateText call for Perplexity with standardized logging & error handling.
export async function callPerplexity(options: PerplexityCallOptions) {
    const model = perplexityInstance(options.model ?? 'sonar-pro') as LanguageModelV1;
    console.log('💡 Starting Perplexity call with options:', options);

    try {
        const result = await generateText({
            model,
            maxSteps: options.maxSteps ?? 5,
            prompt: options.prompt,
        });

        // Log any citations or metadata from Perplexity
        if (result.experimental_providerMetadata?.perplexity) {
            console.log('📚 Perplexity citations:',
                result.experimental_providerMetadata.perplexity.citations);
        }

        console.log('✅ Perplexity call successful:', result);
        return result;
    } catch (error) {
        console.error('❌ Perplexity call failed:', error);
        throw error;
    }
} 