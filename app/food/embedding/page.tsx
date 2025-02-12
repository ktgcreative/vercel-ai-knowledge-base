'use client';

import { useState } from 'react';
import { analyzeWithEmbeddings } from '@/backend/server-actions/food/embedding/analyze';

interface SearchResult {
    answer: string;
    relevantContext: string;
    matches: Array<{
        text: string;
        similarity: number;
        embedding: number[];
    }>;
}

export default function EmbeddingPage() {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<SearchResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const response = await analyzeWithEmbeddings(query);
            setResult(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center">
                    Food Knowledge Search
                </h1>

                <form onSubmit={handleSubmit} className="mb-8">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ask about food history (e.g., 'When was pizza margherita created?')"
                            className="input input-bordered flex-1"
                        />
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isLoading || !query.trim()}
                        >
                            {isLoading ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="alert alert-error mb-4">
                        {error}
                    </div>
                )}

                {result && (
                    <div className="space-y-6">
                        {/* Answer */}
                        <div className="card bg-base-200">
                            <div className="card-body">
                                <h2 className="card-title">Answer</h2>
                                <p className="whitespace-pre-wrap">{result.answer}</p>
                            </div>
                        </div>

                        {/* Matches with Similarity Scores */}
                        <div className="card bg-base-200">
                            <div className="card-body">
                                <h2 className="card-title">Matching Passages</h2>
                                <div className="space-y-4">
                                    {result.matches.map((match, index) => (
                                        <div key={index} className="border-l-4 pl-4" style={{
                                            borderColor: `hsl(${match.similarity * 120}, 70%, 50%)`
                                        }}>
                                            <p className="mb-2">{match.text}</p>
                                            <div className="flex items-center gap-2 text-sm text-base-content/70">
                                                <div className="badge badge-neutral">
                                                    Similarity: {(match.similarity * 100).toFixed(1)}%
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        const el = document.createElement('textarea');
                                                        el.value = match.embedding.join(', ');
                                                        document.body.appendChild(el);
                                                        el.select();
                                                        document.execCommand('copy');
                                                        document.body.removeChild(el);
                                                    }}
                                                    className="btn btn-xs"
                                                    title="Copy embedding vector"
                                                >
                                                    Copy Embedding
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Debug Information */}
                        <div className="card bg-base-200">
                            <div className="card-body">
                                <h2 className="card-title">Debug Information</h2>
                                <div className="overflow-x-auto">
                                    <table className="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>Metric</th>
                                                <th>Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Number of matches</td>
                                                <td>{result.matches.length}</td>
                                            </tr>
                                            <tr>
                                                <td>Average similarity</td>
                                                <td>
                                                    {(result.matches.reduce((acc, m) => acc + m.similarity, 0) / result.matches.length * 100).toFixed(1)}%
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Embedding dimensions</td>
                                                <td>{result.matches[0]?.embedding.length ?? 0}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 