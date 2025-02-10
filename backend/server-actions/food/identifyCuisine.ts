'use server';

import { callOpenAi } from '@/backend/services/ai';
import { performPerplexitySearch } from '../search/perplexity-search';
import {
    getCuisineIdentifierTool,
    getTimelineGeneratorTool,
    getValidateFoodTool,
    getRecipeGeneratorTool,
    getOriginAnalyzerTool
} from './tools';

export async function identifyCuisine(dish: string) {
    try {
        console.log('📝 Starting cuisine identification for:', dish);

        // First, perform a web search to gather current information
        const searchResponse = await performPerplexitySearch(
            `What is the origin, cultural significance, and history of ${dish}? Include details about its cuisine type and evolution over time.`
        );

        const validateTool = await getValidateFoodTool();
        const cuisineIdentifierTool = await getCuisineIdentifierTool();
        const timelineTool = await getTimelineGeneratorTool();
        const recipeTool = await getRecipeGeneratorTool();
        const originTool = await getOriginAnalyzerTool();

        const { toolCalls } = await callOpenAi({
            tools: {
                validate: validateTool,
                analyze: cuisineIdentifierTool,
                timeline: timelineTool,
                recipe: recipeTool,
                origin: originTool,
            },
            maxSteps: 5,
            prompt: `Analyze this dish: "${dish}". Use this additional research information: ${searchResponse.text}

                Follow these steps:
                1. First validate if it's a legitimate food.
                2. Then analyze its culinary background.
                3. Generate a comprehensive historical timeline with at least 5 significant years showing the dish's evolution and cultural impact.
                4. Provide a detailed, step-by-step recipe including ingredients, instructions, cooking time, and servings.
                5. Analyze the dish's origins including native region, historical context, folklore influences, cultural significance, and significant evolution periods.

                Base your analysis on both the provided research and your knowledge.`
        });

        if (!toolCalls?.length) {
            throw new Error('No tool calls received');
        }

        // Log the raw tool call data
        console.log('Raw Tool Calls:', JSON.stringify(toolCalls, null, 2));

        const recipeCall = toolCalls.find((call) => call.toolName === 'recipe');
        const originCall = toolCalls.find((call) => call.toolName === 'origin');

        return {
            toolCalls,
            searchResults: {
                text: searchResponse.text,
                citations: searchResponse.citations
            },
            recipe: recipeCall?.args?.recipe || {},
            originAnalysis: originCall?.args?.originAnalysis || {}
        };
    } catch (error) {
        console.error('❌ Error in cuisine identification:', error);
        return { error: 'Failed to identify cuisine' };
    }
} 