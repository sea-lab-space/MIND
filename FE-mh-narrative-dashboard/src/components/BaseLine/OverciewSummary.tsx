
interface OverviewSummaryProps {
    basicInfoCardData: Record<string, string>;
}

const OverviewSummary: React.FC<OverviewSummaryProps> = ({ basicInfoCardData }) => {
    return (
        <div className="h-full bg-white shadow-sm rounded-xl px-3 py-2 border border-gray-200 flex flex-col">
            <h3 className="text-base font-semibold mb-2">Overview Summary</h3>
            <div className="space-y-1">
                {Object.entries(basicInfoCardData).map(([key, value]) => (
                    <div key={key} className="flex flex-wrap text-sm text-gray-700">
                        <span className="font-semibold text-gray-900 mr-1">{key}:</span>
                        <span>{value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OverviewSummary;
