import Form from 'next/form';
import { identifyCuisine } from './food-tool';
import SubmitButton from './components/SubmitButton';

export default async function CuisinePage({
    searchParams,
}: {
    searchParams: { dish?: string };
}) {
    // Get the dish from URL search params (default to empty string)
    const dish = searchParams.dish || '';
    let result: object | null = null;
    let error = '';

    if (dish) {
        try {
            const response = await identifyCuisine(dish);
            if (response.error) {
                error = response.error;
            } else if (response.toolCalls) {
                result = response.toolCalls;
            }
        } catch (err) {
            error = err instanceof Error ? err.message : 'An unknown error occurred';
        }
    }

    return (
        <div className="min-h-screen mt-20 flex flex-col items-center p-4">
            {/* Using Next.js Form component with GET submission */}
            <Form action="" className="mb-4 text-center">
                <input
                    type="text"
                    name="dish"
                    defaultValue={dish}
                    placeholder="Enter a dish name"
                    className="border p-2 mr-2 w-64"
                />
                <SubmitButton dish={dish} />
            </Form>

            {error && (
                <div className="text-red-600 mb-4">
                    {error}
                </div>
            )}

            {result && (
                <pre className="whitespace-pre-wrap font-mono text-sm max-w-2xl">
                    {JSON.stringify(result, null, 2)}
                </pre>
            )}
        </div>
    );
}
