'use client';

import { useFormStatus } from 'react-dom';

export default function SubmitButton({ dish }: { dish?: string }) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className={`${pending ? 'bg-blue-300' : 'bg-blue-500'
                } text-white px-4 py-2 rounded transition-colors`}
        >
            {pending ? 'Analyzing...' : dish ? 'Re-analyze' : 'Analyze'}
        </button>
    );
} 