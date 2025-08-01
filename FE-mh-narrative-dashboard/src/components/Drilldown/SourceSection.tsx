import { DatasourceIconTypes } from "@/types/props";
import DataSourceIcon from "../DatasourceIcon";
import type { DatasourceIconType } from "@/types/props";


interface SourcesSectionProps {
    sources: DatasourceIconTypes[] | undefined;
}

const SourcesSection: React.FC<SourcesSectionProps> = ({ sources }) => {
    return (
        <div className="flex items-center gap-4 text-sm text-[#757575]">
            <span>Sources:</span>
            {sources?.map((ds) => (
                <DataSourceIcon key={ds.type} showType iconType={ds.type as DatasourceIconType} />
            ))}
        </div>
    );
};

export default SourcesSection;
