'use server';

import { callOpenAi } from '@/backend/lib/ai';
import { getValidateFoodTool } from './tools/validate-food';
import { getCuisineIdentifierTool } from './tools/cuisine-identifier';
import { getTimelineGeneratorTool } from './tools/generate-timeline';

export async function identifyCuisine(dish: string) {
    try {
        console.log('📝 Starting cuisine identification for:', dish);
        const validateTool = await getValidateFoodTool();
        const cuisineIdentifierTool = await getCuisineIdentifierTool();
        const timelineTool = await getTimelineGeneratorTool();

        const { toolCalls } = await callOpenAi({
            tools: {
                validate: validateTool,
                analyze: cuisineIdentifierTool,
                timeline: timelineTool,
            },
            maxSteps: 5,
            prompt: `Analyze this dish: "${dish}". Follow these steps:
                1. First validate if it's a legitimate food
                2. Then analyze its culinary background
                3. Finally, generate a comprehensive historical timeline with at least 5 significant years showing the dish's evolution and cultural impact through history.
                Be thorough and precise, ensuring the timeline covers different periods from the dish's origin to modern times.`
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