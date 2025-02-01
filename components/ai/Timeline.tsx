'use client';

interface TimelineEntry {
    year: number;
    title: string;
    detail: string;
    significance: string;
}

interface TimelineProps {
    entries: TimelineEntry[];
    summary: string;
}

const CheckIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-5 w-5"
    >
        <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            clipRule="evenodd"
        />
    </svg>
);

export function Timeline({ entries, summary }: TimelineProps) {
    return (
        <div className="w-full max-w-4xl mx-auto px-4">
            <div className="bg-base-200 p-4 rounded-lg mb-8">
                <h3 className="font-bold text-lg mb-2">Historical Summary</h3>
                <p className="text-base leading-relaxed">{summary}</p>
            </div>

            <div className="relative">
                <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
                    {entries.map((entry, index) => (
                        <li key={entry.year}>
                            {index > 0 && <hr />}
                            <div className="timeline-middle">
                                <CheckIcon />
                            </div>
                            <div className={`${index % 2 === 0 ? 'timeline-start' : 'timeline-end'} mb-10 ${index % 2 === 0 ? 'md:text-end' : ''}`}>
                                <time className="font-mono italic text-sm">{entry.year}</time>
                                <div className="text-lg font-black my-2">{entry.title}</div>
                                <div className="text-base leading-relaxed">{entry.detail}</div>
                                <div className="text-sm text-base-content/70 mt-3 italic">
                                    {entry.significance}
                                </div>
                            </div>
                            {index < entries.length - 1 && <hr />}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}