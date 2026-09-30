import StoriesGrid from "../components/StoriesGrid";

export default function StoriesPage() {
    return (
        <div className="w-full bg-white font-sans text-zinc-900 pb-20 pt-32 px-6">
            <div className="max-w-7xl mx-auto">
                <StoriesGrid />
            </div>
        </div>
    );
}
