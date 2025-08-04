import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SectionProps } from "@/types/props";
import { cn } from "@/lib/utils";

const Section: React.FC<SectionProps> = (props) => {
  const {
    title,
    isExpanded,
    onClick,
    subtitle,
    icon,
    children,
    className,
    action,
  } = props;

  return (
      <div className="flex flex-col gap-1 w-full">
        {/* Header row with button after the title */}
        <div className="flex items-center gap-3">
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

          <h2 className="text-lg font-semibold text-[#000000]">
            {title}
            {subtitle && <span className="text-lg text-[#000000] font-normal"> - {subtitle}</span>}
          </h2>

          {/* ✅ This is now right after the title */}
          {action && <div>{action}</div>}

          {icon && <div className="flex-shrink-0">{icon}</div>}
        </div>

        {/* Section content */}
        {children && <div className={cn("px-14", className)}>{children}</div>}
      </div>
  );
};


export default Section;
