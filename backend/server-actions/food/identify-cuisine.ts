'use server';

import { callVercelAi } from '@/backend/lib/ai/vercel-call-factory';
import { getValidateFoodTool } from './tools/validate-food';
import { getCuisineIdentifierTool } from './tools/cuisine-identifier';

export async function identifyCuisine(dish: string) {
    try {
        console.log('📝 Starting cuisine identification for:', dish);
        const validateTool = await getValidateFoodTool();
        const cuisineIdentifierTool = await getCuisineIdentifierTool();

        const { toolCalls } = await callVercelAi({
            tools: {
                validate: validateTool,
                analyze: cuisineIdentifierTool
            },
            maxSteps: 5,
            prompt: `Analyze this dish: "${dish}". First validate if it's a legitimate food, then analyze its culinary background. Be thorough and precise.`
        });

        if (!toolCalls?.length) {
            throw new Error('No tool calls received');
        }

        // Log the raw tool call data
        console.log('Raw Tool Calls:', JSON.stringify(toolCalls, null, 2));

        return {
            toolCalls
        };
    } catch (error) {
        console.error('❌ Error in cuisine identification:', error);
        return { error: 'Failed to identify cuisine' };
    }
} 