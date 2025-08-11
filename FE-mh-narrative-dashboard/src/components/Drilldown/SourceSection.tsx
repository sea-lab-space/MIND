import DataSourceIcon from "../DatasourceIcon";
import type { DatasourceIconType } from "@/types/props";


interface SourcesSectionProps {
    sources: DatasourceIconType[] | undefined;
}

const SourcesSection: React.FC<SourcesSectionProps> = ({ sources }) => {
    return (
      <div className="flex items-center gap-4 text-sm">
        <span className="text-s font-small italic text-gray-600">
          Cited sources:
        </span>
        {sources?.map((ds) => (
          <DataSourceIcon
            key={ds}
            showType
            iconType={ds as DatasourceIconType}
          />
        ))}
      </div>
    );
};

export default SourcesSection;
