import { AIForm } from '@/components/ai/AIForm';
import { IoFastFood } from 'react-icons/io5';

export default function CuisinePage() {
    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-4xl bg-white backdrop-blur-lg rounded-lg p-8 mx-auto">
                <div className="text-center mb-8">

                    <IoFastFood className="w-12 h-12 m-5 p-2 bg-sky-500/80 text-white rounded-full  mx-auto mb-2" />

                    <h1 className="text-3xl font-bold mb-2">Cuisine Timeline Explorer</h1>
                    <p className="text-base-content/70">
                        Discover the historical journey of any dish through time
                    </p>
                </div>

                <AIForm
                    inputName="dish"
                    inputPlaceholder="Enter a dish name (e.g., Pizza, Sushi, Paella)"
                />
            </div>
        </div>
    );
}
