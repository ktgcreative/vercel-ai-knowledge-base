'use client';

import { ReactNode, useState } from 'react';
import { identifyCuisine } from '@/backend/server-actions/food/identify-cuisine';
import { Timeline } from './Timeline';

interface AIFormProps {
    inputPlaceholder?: string;
    inputName?: string;
    defaultValue?: string;
    children?: ReactNode;
    className?: string;
}

interface SearchResults {
    text: string;
    citations: Array<{
        url: string;
        title?: string;
    }>;
}

export function AIForm({
    inputPlaceholder = "Enter your query",
    inputName = "query",
    defaultValue = "",
}: AIFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [result, setResult] = useState<any | null>(null);
    const [error, setError] = useState('');
    const [dish, setDish] = useState(defaultValue);
    const [searchResults, setSearchResults] = useState<SearchResults | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setResult(null);
        setSearchResults(null);

        try {
            const response = await identifyCuisine(dish);
            if (response.error) {
                setError(response.error);
            } else if (response.toolCalls) {
                const validationCall = response.toolCalls.find(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (call: any) => call.toolName === 'validate'
                );
                const analysisCall = response.toolCalls.find(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (call: any) => call.toolName === 'analyze'
                );
                const timelineCall = response.toolCalls.find(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (call: any) => call.toolName === 'timeline'
                );

                setResult({
                    validation: validationCall?.args,
                    analysis: analysisCall?.args,
                    timeline: timelineCall?.args?.timelineEntries || [],
                    summary: timelineCall?.args?.summary || ''
                });

                // Set the search results
                setSearchResults(response.searchResults);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col mb-10 sm:flex-row gap-2 items-center justify-center w-full"
            >
                <input
                    type="text"
                    name={inputName}
                    value={dish}
                    onChange={(e) => setDish(e.target.value)}
                    placeholder={inputPlaceholder}
                    className="input input-bordered w-full max-w-md"
                />
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading || !dish.trim()}
                >
                    {isLoading ? 'Loading...' : 'Submit'}
                </button>
            </form>

            {error && (
                <div className="text-error mb-4">
                    {error}
                </div>
            )}

            {result && (
                <div className="w-full space-y-8">
                    {/* Web Search Results Section */}
                    {searchResults && (
                        <div className="card bg-base-200">
                            <div className="card-body">
                                <h2 className="card-title">Web Research</h2>
                                <div className="prose max-w-none">
                                    <div className="whitespace-pre-wrap">{searchResults.text}</div>

                                    {searchResults.citations?.length > 0 && (
                                        <div className="mt-6 border-t pt-4">
                                            <h3 className="text-lg font-semibold mb-3">Sources</h3>
                                            <ul className="space-y-2">
                                                {searchResults.citations.map((citation, index) => (
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

                    {/* Validation Section */}
                    {result.validation && (
                        <div className="card bg-base-200">
                            <div className="card-body">
                                <h2 className="card-title">Dish Validation</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p><span className="font-bold">Type:</span> {result.validation.validation.cuisineType}</p>
                                        <p><span className="font-bold">Category:</span> {result.validation.validation.category}</p>
                                        <p><span className="font-bold">Confidence:</span> {result.validation.validation.confidence}</p>
                                    </div>
                                    <div>
                                        <p className="font-bold">Dietary Information:</p>
                                        <ul className="list-disc list-inside">
                                            {result.validation.validation.dietaryInfo.containsAllergens?.map((allergen: string) => (
                                                <li key={allergen}>{allergen}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Analysis Section */}
                    {result.analysis && (
                        <div className="card bg-base-200">
                            <div className="card-body">
                                <h2 className="card-title">Culinary Analysis</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p><span className="font-bold">Primary Cuisine:</span> {result.analysis.analysis.primaryCuisine}</p>
                                        <p><span className="font-bold">Regional Variant:</span> {result.analysis.analysis.regionalVariant}</p>
                                        <p><span className="font-bold">Authenticity:</span> {result.analysis.analysis.authenticity}</p>
                                    </div>
                                    <div>
                                        <p className="font-bold">Characteristics:</p>
                                        <p><span className="font-bold">Spice Level:</span> {result.analysis.analysis.characteristics.spiceLevel}</p>
                                        <p><span className="font-bold">Serving Style:</span> {result.analysis.analysis.characteristics.servingStyle}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Timeline Section */}
                    {result.timeline && result.timeline.length > 0 && (
                        <Timeline
                            entries={result.timeline}
                            summary={result.summary}
                        />
                    )}
                </div>
            )}
        </div>
    );
} 