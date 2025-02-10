'use server';

import { tool } from 'ai';
import { z } from 'zod';

export async function getValidateFoodTool() {
    return tool({
        description: 'Validate and classify a food dish with detailed assessment',
        parameters: z.object({
            dish: z.string().describe('The food dish to validate'),
            validation: z.object({
                isValidFood: z.boolean().describe('Whether this is a legitimate food dish'),
                confidence: z.enum(['High', 'Medium', 'Low']).describe('Confidence level in the assessment'),
                category: z
                    .enum([
                        'Main_Course',
                        'Appetizer',
                        'Dessert',
                        'Beverage',
                        'Snack',
                        'Breakfast',
                        'Soup',
                        'Unknown'
                    ])
                    .describe('Category of the food item'),
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
} 