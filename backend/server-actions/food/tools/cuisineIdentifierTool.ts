'use server';

import { tool } from 'ai';
import { z } from 'zod';

export async function getCuisineIdentifierTool() {
    return tool({
        description: 'Identify and analyze cuisine characteristics',
        parameters: z.object({
            dish: z.string()
                .describe('The food dish to analyze'),
            analysis: z.object({
                primaryCuisine: z.string()
                    .describe('Primary cuisine type'),
                regionalVariant: z.string().optional()
                    .describe('Specific regional variant if applicable'),
                culturalOrigin: z.object({
                    country: z.string(),
                    region: z.string().optional(),
                    historicalContext: z.string().optional()
                })
                    .describe('Cultural origin information'),
                characteristics: z.object({
                    mainIngredients: z.array(z.string()),
                    cookingMethods: z.array(z.string()),
                    flavorProfile: z.array(z.string()),
                    spiceLevel: z
                        .enum(['Mild', 'Medium', 'Hot', 'Very_Hot', 'None'])
                        .describe('Spice level of the dish'),
                    servingStyle: z.string()
                        .describe('Serving style of the dish')
                })
                    .describe('Key characteristics of the dish'),
                authenticity: z
                    .enum(['Traditional', 'Fusion', 'Modern_Adaptation', 'Unknown'])
                    .describe('Assessment of dish authenticity')
            }).describe('Detailed cuisine analysis')
        }),
        execute: async ({ dish, analysis }) => {
            console.log('🍽️ Cuisine Analysis Tool Called:', { dish, analysis });
            return { dish, analysis };
        }
    });
} 