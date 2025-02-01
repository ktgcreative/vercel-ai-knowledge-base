'use client';

import { ReactNode, useState } from 'react';
import { identifyCuisine } from '@/backend/server-actions/food/identify-cuisine';

interface AIFormProps {
    inputPlaceholder?: string;
    inputName?: string;
    defaultValue?: string;
    children?: ReactNode;
    className?: string;
}

export function AIForm({
    inputPlaceholder = "Enter your query",
    inputName = "query",
    defaultValue = "",
}: AIFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<object | null>(null);
    const [error, setError] = useState('');
    const [dish, setDish] = useState(defaultValue);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await identifyCuisine(dish);
            if (response.error) {
                setError(response.error);
            } else if (response.toolCalls) {
                setResult(response.toolCalls);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
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
                <div className="text-red-600 mb-4">
                    {error}
                </div>
            )}

            {result && (
                <div className="mockup-code">
                    <pre className="whitespace-pre-wrap font-mono text-sm max-w-2xl">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
} 