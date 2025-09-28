import OverviewCardComponent from "@/components/Overview/OverviewCardComponent";

interface OverviewComponentProps {
  overviewData: any;
  isExpanded: boolean;
  isDrillDown: boolean;
}
export default function OverviewComponent({
                                            overviewData,
                                            isExpanded,
                                            isDrillDown,
                                          }: OverviewComponentProps) {
    const basicInfoCardData = overviewData.basicInfoCard;
    const infoData = overviewData.infoCards;

    const clinicalRelevantInfo = overviewData.clinicalHistory;

    return (
      <div className="transition-all duration-300 text-sm">
        <div
          className={`flex gap-4 mx-auto items-stretch ${
            isDrillDown ? "flex-col" : "flex-col sm:flex-row"
          }`}
        >
          {isExpanded ? (
            <div
              className={`flex flex-col gap-2`}
            >
              <OverviewCardComponent
                key={"overview-1"}
                title={"Physical"}
              >
                {clinicalRelevantInfo["physical"]}
              </OverviewCardComponent>
              <OverviewCardComponent
                key={"overview-2"}
                title={"Psychological"}
              >
                {clinicalRelevantInfo["psychological"]}
              </OverviewCardComponent>
            </div>
          ) : null}
        </div>
      </div>
    );
}
