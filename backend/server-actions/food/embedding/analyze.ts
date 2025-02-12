'use server';

import fs from 'fs';
import path from 'path';
import { createOpenAI } from '@ai-sdk/openai';
import { cosineSimilarity, embed, embedMany, generateText } from 'ai';

if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function analyzeWithEmbeddings(query: string) {
    try {
        // Read and process the knowledge base
        const knowledgeBase = fs.readFileSync(
            path.join(process.cwd(), 'backend/server-actions/food/embedding/food-knowledge.txt'),
            'utf8'
        );

        // Split into chunks
        const chunks = knowledgeBase
            .split('\n\n')
            .map(chunk => chunk.trim())
            .filter(chunk => chunk.length > 0);

        // Create embeddings for all chunks
        const { embeddings } = await embedMany({
            model: openai.embedding('text-embedding-3-small'),
            values: chunks,
        });

        // Create in-memory database
        const db = embeddings.map((embedding, i) => ({
            embedding,
            value: chunks[i],
        }));

        // Create embedding for the query
        const { embedding: queryEmbedding } = await embed({
            model: openai.embedding('text-embedding-3-small'),
            value: query,
        });

        // Find most relevant context with similarity scores
        const matches = db
            .map(item => ({
                text: item.value,
                embedding: item.embedding,
                similarity: cosineSimilarity(queryEmbedding, item.embedding),
            }))
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 3);

        const context = matches.map(m => m.text).join('\n\n');

        // Generate response using the context
        const { text } = await generateText({
            model: openai('gpt-4o'),
            prompt: `Answer the following question based only on the provided context:
                     ${context}

                     Question: ${query}`,
        });

        return {
            answer: text,
            relevantContext: context,
            matches: matches,
        };
    } catch (error) {
        console.error('Error in embedding analysis:', error);
        throw error;
    }
} 