'use client';

import { useState } from 'react';
import { IoSearch } from 'react-icons/io5';
import { performPerplexitySearch, type SearchResponse } from '@/backend/server-actions/search/perplexity-search';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState<SearchResponse | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await performPerplexitySearch(query);
            setResult(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-4xl bg-white backdrop-blur-lg rounded-lg p-8 mx-auto">
                <div className="text-center mb-8">
                    <IoSearch className="w-12 h-12 m-5 p-2 bg-indigo-500/80 text-white rounded-full mx-auto mb-2" />

                    <h1 className="text-3xl font-bold mb-2">Web Search Assistant</h1>
                    <p className="text-base-content/70">
                        Get detailed answers with citations from across the web
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col mb-10 sm:flex-row gap-2 items-center justify-center w-full"
                >
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter your search query (e.g., How does photosynthesis work?)"
                        className="input input-bordered w-full max-w-md"
                    />
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading || !query.trim()}
                    >
                        {isLoading ? 'Searching...' : 'Search'}
                    </button>
                </form>

                {error && (
                    <div className="text-error mb-4">
                        {error}
                    </div>
                )}

                {result && (
                    <div className="card bg-base-200">
                        <div className="card-body">
                            <div className="prose max-w-none">
                                <div className="whitespace-pre-wrap">{result.text}</div>

                                {result.citations && result.citations.length > 0 && (
                                    <div className="mt-6 border-t pt-4">
                                        <h3 className="text-lg font-semibold mb-3">Sources</h3>
                                        <ul className="space-y-2">
                                            {result.citations.map((citation, index) => (
                                                <li key={index} className="flex items-start">
                                                    <span className="mr-2 text-base-content/70">[{index + 1}]</span>
                                                    <a
                                                        href={citation.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary hover:underline break-all"
                                                    >
                                                        {citation.title || citation.url}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 