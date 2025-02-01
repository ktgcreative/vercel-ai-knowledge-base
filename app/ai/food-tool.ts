'use server';

import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { tool } from 'ai';

const validateFoodTool = tool({
    description: 'Validate and classify a food dish with detailed assessment',
    parameters: z.object({
        dish: z.string().describe('The food dish to validate'),
        validation: z.object({
            isValidFood: z.boolean().describe('Whether this is a legitimate food dish'),
            confidence: z.enum(['High', 'Medium', 'Low']).describe('Confidence level in the assessment'),
            category: z.enum([
                'Main_Course',
                'Appetizer',
                'Dessert',
                'Beverage',
                'Snack',
                'Breakfast',
                'Unknown'
            ]).describe('Category of the food item'),
            cuisineType: z.string().describe('The type of cuisine this dish belongs to'),
            concerns: z.array(z.string()).describe('Any concerns about the input'),
            dietaryInfo: z.object({
                isVegetarian: z.boolean().optional(),
                isVegan: z.boolean().optional(),
                isGlutenFree: z.boolean().optional(),
                isDairyFree: z.boolean().optional(),
                containsAllergens: z.array(z.string()).optional()
            }).describe('Dietary information about the dish')
        }).describe('Detailed validation results')
    }),
    execute: async ({ dish, validation }) => {
        console.log('🔍 Validation Tool Called:', { dish, validation });
        return { dish, validation };
    }
});

const cuisineIdentifierTool = tool({
    description: 'Identify and analyze cuisine characteristics',
    parameters: z.object({
        dish: z.string().describe('The food dish to analyze'),
        analysis: z.object({
            primaryCuisine: z.string().describe('Primary cuisine type'),
            regionalVariant: z.string().optional().describe('Specific regional variant if applicable'),
            culturalOrigin: z.object({
                country: z.string(),
                region: z.string().optional(),
                historicalContext: z.string().optional()
            }).describe('Cultural origin information'),
            characteristics: z.object({
                mainIngredients: z.array(z.string()),
                cookingMethods: z.array(z.string()),
                flavorProfile: z.array(z.string()),
                spiceLevel: z.enum(['Mild', 'Medium', 'Hot', 'Very_Hot', 'None']),
                servingStyle: z.string()
            }).describe('Key characteristics of the dish'),
            authenticity: z.enum(['Traditional', 'Fusion', 'Modern_Adaptation', 'Unknown'])
                .describe('Assessment of dish authenticity')
        }).describe('Detailed cuisine analysis')
    }),
    execute: async ({ dish, analysis }) => {
        console.log('🍽️ Cuisine Analysis Tool Called:', { dish, analysis });
        return { dish, analysis };
    }
});

export async function identifyCuisine(dish: string) {
    try {
        console.log('📝 Starting cuisine identification for:', dish);
        const { toolCalls } = await generateText({
            model: openai('gpt-4o-mini'),

            tools: {
                validate: validateFoodTool,
                analyze: cuisineIdentifierTool
            },
            maxSteps: 5,
            toolChoice: 'required',
            prompt: `Analyze this dish: "${dish}". First validate if it's a legitimate food, then analyze its culinary background. Be thorough and precise.`
        });

        if (!toolCalls?.length) {
            throw new Error('No tool calls received');
        }

        // Log the raw data
        console.log('Raw Tool Calls:', JSON.stringify(toolCalls, null, 2));

        return {
            toolCalls
        };
    } catch (error) {
        console.error('❌ Error in cuisine identification:', error);
        return { error: 'Failed to identify cuisine' };
    }
} 