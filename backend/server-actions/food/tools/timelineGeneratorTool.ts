'use server';

import { tool } from 'ai';
import { z } from 'zod';

export async function getTimelineGeneratorTool() {
    return tool({
        description: 'Generate multiple timeline entries showing the evolution of a dish across different historical eras',
        parameters: z.object({
            dish: z.string()
                .describe('The food dish to generate timeline for'),
            timelineEntries: z.array(z.object({
                year: z.number()
                    .describe('The year of this timeline entry'),
                title: z.string()
                    .min(3)
                    .max(30)
                    .describe('A short (preferably two-word) title describing this historical era'),
                detail: z.string()
                    .describe('Historical details or events for this era'),
                significance: z.string()
                    .describe('The significance of this year in the dish\'s history')
            })).min(5)
                .describe('At least 5 significant historical eras in the dish\'s history'),
            summary: z.string()
                .describe('A brief summary of the dish\'s historical evolution')
        }),
        execute: async ({ dish, timelineEntries, summary }) => {
            console.log('📅 Timeline Generator Tool Called:', { dish, timelineEntries });
            return {
                dish,
                timeline: timelineEntries,
                summary
            };
        }
    });
} 