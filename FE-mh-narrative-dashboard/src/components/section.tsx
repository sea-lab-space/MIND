import { ChevronDown, Circle, Dot } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SectionProps } from "@/types/props";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    shouldExpand = true
  } = props;

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="sticky top-0 bg-white z-10 flex items-center gap-2">
        <Button
          size="icon"
          className={cn(
            "relative rounded-full bg-white shadow-md transition-all cursor-pointer",
            {
              "hover:bg-gray-100 hover:shadow-lg": shouldExpand,
              "hover:bg-white": !shouldExpand,
            }
          )}
          onClick={onClick}
        >
          {shouldExpand ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <ChevronDown
                  className={`h-5 w-5 text-[#000000] transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </TooltipTrigger>
              <TooltipContent>
                {isExpanded ? "Collapse" : "Expand"}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Circle className={`h-5 w-5 text-[#000000]`} />
          )}
        </Button>

        <h2 className="text-lg font-semibold text-[#000000]">
          {title}
          {subtitle && (
            <span className="text-sm text-[#000000] font-normal">
              {" "}
              - {subtitle}
            </span>
          )}
        </h2>

        {action && <div>{action}</div>}
        {icon && <div className="flex-shrink-0">{icon}</div>}
      </div>

      {children && <div className={cn("px-14", className)}>{children}</div>}
    </div>
  );
};


export default Section;
