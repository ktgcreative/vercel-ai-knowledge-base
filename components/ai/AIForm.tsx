'use client';

import { ReactNode, useState } from 'react';
import { identifyCuisine } from '@/backend/server-actions/food/identifyCuisine';
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
                    summary: timelineCall?.args?.summary || '',
                    recipe: response.recipe,
                    originAnalysis: response.originAnalysis
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
                                <div className="prose prose-base prose-slate">
                                    {/* Split the text into paragraphs and map them */}
                                    {searchResults.text.split('\n\n').map((paragraph, index) => {
                                        const trimmedParagraph = paragraph.trim();
                                        if (!trimmedParagraph) return null;

                                        // Handle different paragraph types
                                        const formattedText = trimmedParagraph
                                            // Replace markdown bold syntax with spans
                                            .replace(/\*\*(.*?)\*\*/g, '<span class="font-bold">$1</span>')
                                            // Replace markdown lists with proper HTML
                                            .replace(/- /g, '• ');

                                        return (
                                            <div key={index}>
                                                {trimmedParagraph.startsWith('###') ? (
                                                    <h3>{trimmedParagraph.replace('###', '').trim()}</h3>
                                                ) : (
                                                    <p dangerouslySetInnerHTML={{ __html: formattedText }} />
                                                )}
                                            </div>
                                        );
                                    })}

                                    {searchResults.citations?.length > 0 && (
                                        <div className="not-prose mt-6 border-t pt-4">
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

                    {/* Origin Analysis Section */}
                    {result.originAnalysis && Object.keys(result.originAnalysis).length > 0 && (
                        <div className="card bg-base-200">
                            <div className="card-body">
                                <h2 className="card-title">Origin Analysis</h2>
                                <p><span className="font-bold">Native Region:</span> {result.originAnalysis.nativeRegion}</p>
                                <p><span className="font-bold">Historical Context:</span> {result.originAnalysis.historicalContext}</p>
                                {result.originAnalysis.folklore && (
                                    <p><span className="font-bold">Folklore:</span> {result.originAnalysis.folklore}</p>
                                )}
                                <p><span className="font-bold">Cultural Significance:</span> {result.originAnalysis.culturalSignificance}</p>
                                {result.originAnalysis.evolution && result.originAnalysis.evolution.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold mt-4">Evolution:</h3>
                                        <ul className="list-disc list-inside">
                                            {result.originAnalysis.evolution.map((period: { period: string; description: string; impact: string }, index: number) => (
                                                <li key={index}>
                                                    <span className="font-bold">{period.period}:</span> {period.description} (<i>{period.impact}</i>)
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Recipe Section */}
                    {result.recipe && Object.keys(result.recipe).length > 0 && (
                        <div className="card bg-base-200">
                            <div className="card-body">
                                <h2 className="card-title">Recipe</h2>
                                {result.recipe.description && (
                                    <p>{result.recipe.description}</p>
                                )}
                                <h3 className="text-lg font-semibold mt-4">Ingredients:</h3>
                                <ul className="list-disc list-inside">
                                    {result.recipe.ingredients && result.recipe.ingredients.map((ing: { name: string; quantity: string; unit: string; preparation?: string }, idx: number) => (
                                        <li key={idx}>
                                            {ing.name}: {ing.quantity} {ing.unit} {ing.preparation ? `(${ing.preparation})` : ''}
                                        </li>
                                    ))}
                                </ul>
                                <h3 className="text-lg font-semibold mt-4">Steps:</h3>
                                <ol className="list-decimal list-inside">
                                    {result.recipe.steps && result.recipe.steps.map((step: string, idx: number) => (
                                        <li key={idx}>{step}</li>
                                    ))}
                                </ol>
                                {result.recipe.cookingTime && (
                                    <p className="mt-2"><span className="font-bold">Cooking Time:</span> {result.recipe.cookingTime} minutes</p>
                                )}
                                {result.recipe.servings && (
                                    <p><span className="font-bold">Servings:</span> {result.recipe.servings}</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 