'use server';

import { generateText, Tool, LanguageModelV1 } from 'ai';
import { openai } from '@ai-sdk/openai';

export interface VercelAiCallOptions {
    model?: LanguageModelV1;
    tools?: Record<string, Tool>;
    maxSteps?: number;
    toolChoice?: 'auto' | 'none' | 'required';
    prompt: string;
}

// callVercelAi wraps the Vercel AI generateText call with standardized logging & error handling.
export async function callVercelAi(options: VercelAiCallOptions) {
    const defaultModel = openai('gpt-4o-mini') as LanguageModelV1;
    console.log('💡 Starting Vercel AI call with options:', options);
    try {
        const result = await generateText({
            model: options.model ?? defaultModel,
            tools: options.tools,
            maxSteps: options.maxSteps ?? 5,
            toolChoice: options.toolChoice ?? 'required',
            prompt: options.prompt,
        });
        console.log('✅ Vercel AI call successful:', result);
        return result;
    } catch (error) {
        console.error('❌ Vercel AI call failed:', error);
        throw error;
    }
} 