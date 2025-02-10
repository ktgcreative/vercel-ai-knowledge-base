'use server';

import { tool } from 'ai';
import { z } from 'zod';

export async function getRecipeGeneratorTool() {
    return tool({
        description: 'Generate a comprehensive recipe for a food dish including detailed ingredients and instructions',
        parameters: z.object({
            dish: z.string().describe('The name of the food dish'),
            recipe: z.object({
                ingredients: z.array(z.object({
                    name: z.string().describe('Name of the ingredient'),
                    quantity: z.number().describe('Quantity required for the ingredient'),
                    unit: z.string().describe('Unit of measurement (e.g., grams, cups)'),
                    preparation: z.string().optional().describe('Optional preparation instruction (e.g., chopped, minced)')
                })).min(1).describe('List of ingredients required for the recipe'),
                steps: z.array(z.string()).min(1).describe('Step by step cooking instructions'),
                cookingTime: z.number().optional().describe('Total cooking time in minutes'),
                servings: z.number().optional().describe('Number of servings this recipe produces'),
                description: z.string().optional().describe('A brief description of the recipe')
            }).describe('Recipe details including ingredients and cooking instructions')
        }),
        execute: async ({ dish, recipe }) => {
            console.log('🍳 Recipe Generator Tool Called:', { dish, recipe });
            // Here you can implement additional logic for recipe generation if needed.
            return { dish, recipe };
        }
    });
} 