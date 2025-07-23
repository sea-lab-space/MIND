import { DatasourceIconTypes } from "@/types/props";
import DataSourceIcon from "../DatasourceIcon";
import type { DatasourceIconType } from "@/types/props";

const SourcesSection = () => {
    const dataSources = Object.values(DatasourceIconTypes).slice(0, 3);
    return (
        <div className="flex items-center gap-4 text-sm text-[#757575]">
            <span>Sources:</span>
            {dataSources.map((ds) => (
                <DataSourceIcon key={ds} showType iconType={ds as DatasourceIconType} />
            ))}
        </div>
    );
};

export default SourcesSection;
