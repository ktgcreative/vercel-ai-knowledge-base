import { AIForm } from '@/components/ai/AIForm';

export default function CuisinePage() {
    return (
        <div className="min-h-screen mt-20 flex flex-col items-center p-4">
            <AIForm
                inputName="dish"
                inputPlaceholder="Enter a dish name"
            />
        </div>
    );
}
