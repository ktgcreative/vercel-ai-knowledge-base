'use server';

import { callPerplexity } from '@/backend/lib/ai';

export interface SearchResponse {
    text: string;
    citations: Array<{
        url: string;
        title?: string;
    }>;
}

export async function performPerplexitySearch(query: string): Promise<SearchResponse> {
    try {
        const response = await callPerplexity({
            prompt: query,
            model: 'sonar-pro'
        });

        // Extract and type-check citations
        const rawCitations = response.experimental_providerMetadata?.perplexity?.citations;
        const citations = Array.isArray(rawCitations) ? rawCitations.filter((c): c is string => typeof c === 'string') : [];

        // Format citations
        const formattedCitations = citations.map(citation => {
            try {
                const url = new URL(citation);
                return {
                    url: citation,
                    title: url.hostname.replace(/^www\./, '') + url.pathname.replace(/[/-]/g, ' ').trim()
                };
            } catch {
                return { url: citation, title: citation };
            }
        });

        return {
            text: response.text,
            citations: formattedCitations
        };
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Search failed');
    }
} 