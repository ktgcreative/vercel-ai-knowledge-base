'use server';

import { tool } from 'ai';
import { z } from 'zod';

export async function getOriginAnalyzerTool() {
    return tool({
        description: 'Analyze and provide detailed origins of a food dish, including its cultural, historical, and folklore influences',
        parameters: z.object({
            dish: z.string().describe('The food dish to analyze'),
            originAnalysis: z.object({
                nativeRegion: z.string().describe('The native region or area where the dish originated'),
                historicalContext: z.string().describe('Historical context and evolution of the dish over time'),
                folklore: z.string().optional().describe('Any folklore, myths, or legends associated with the dish'),
                culturalSignificance: z.string().describe('The cultural impact or significance of the dish'),
                evolution: z.array(z.object({
                    period: z.string().describe('Time period or era (e.g., "Medieval Era", "Modern Day")'),
                    description: z.string().describe('How the dish evolved during this period'),
                    impact: z.string().describe('Impact of the changes on the dish\'s current form')
                })).min(1).describe('Significant periods in the dish\'s evolution')
            }).describe('Detailed origin analysis including historical, cultural, and folkloric insights')
        }),
        execute: async ({ dish, originAnalysis }) => {
            console.log('🏛️ Origin Analyzer Tool Called:', { dish, originAnalysis });
            // Additional analysis logic can be added here if needed.
            return { dish, originAnalysis };
        }
    });
} 