import OverviewSummary from "@/components/BaseLine/OverciewSummary";

const PassiveSensingTab = ({ overviewCardData }) => {
    return (
        <div className="flex gap-4 h-full">
            {/* Left Overview */}
            <div className="w-[260px] shrink-0 h-full overflow-y-auto">
                <OverviewSummary basicInfoCardData={overviewCardData} />
            </div>

            {/* Right Content */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 border rounded-xl shadow">
                <h2 className="text-lg font-semibold">Passive Sensing Data</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    Visualization of passive data goes here.
                </p>
            </div>
        </div>
    );
};

export default PassiveSensingTab;
