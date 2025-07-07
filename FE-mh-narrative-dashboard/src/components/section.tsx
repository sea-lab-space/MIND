import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SectionProps } from "@/types/props";

const Section: React.FC<SectionProps> = (props) => {
  const { title, isExpanded, onClick, subtitle, icon, children } = props;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button
          size="icon"
          className="relative rounded-full bg-white shadow-md transition-all hover:bg-gray-100 hover:shadow-lg"
          onClick={onClick}
        >
          <ChevronDown
            className={`h-5 w-5 text-[#000000] transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </Button>
        <h2 className="text-xl font-semibold text-[#000000]">
          {title}
          <span className="text-lg text-[#000000] font-normal">
            {" "}- {subtitle}
          </span>
        </h2>
        {icon && <div className="flex-shrink-0">{icon}</div>}
      </div>
      {children && <div className="px-14">{children}</div>}
    </div>
  );
};

export default Section;
