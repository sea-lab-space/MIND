import { Button } from "@/components/ui/button";
import { Close } from "@radix-ui/react-dialog";
import { SquareX, X } from "lucide-react";

interface HeaderSectionProps {
  linkViewsEnabled: boolean;
  setLinkViewsEnabled: (val: boolean) => void;
  title: string;
  onClick: () => void;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  linkViewsEnabled,
  setLinkViewsEnabled,
  title,
  onClick,
}) => {
  const isUseLinkedViews = linkViewsEnabled;
  setLinkViewsEnabled(false)
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold text-[#1e1e1e]">{title}</h1>
      </div>
      <div>
        <Button variant="outline" onClick={onClick}>
          <X />
        </Button>
      </div>
      {/*<div className="flex items-center">*/}
      {/*    <div className="text-right"> size="icon" */}
      {/*        <div className="text-sm text-[#757575]">Link Views</div>*/}
      {/*        <div className="text-sm text-[#757575]">Selected: June 10, 2025</div>*/}
      {/*    </div>*/}
      {/*    <Button*/}
      {/*        variant="ghost"*/}
      {/*        size="sm"*/}
      {/*        onClick={() => setLinkViewsEnabled(!linkViewsEnabled)}*/}
      {/*        className="p-2"*/}
      {/*    >*/}
      {/*        <div*/}
      {/*            className={`w-12 h-6 rounded-full transition-colors ${*/}
      {/*                linkViewsEnabled ? "bg-[#1e1e1e]" : "bg-[#d9d9d9]"*/}
      {/*            }`}*/}
      {/*        >*/}
      {/*            <div*/}
      {/*                className={`w-5 h-5 bg-white rounded-full transition-transform mt-0.5 ${*/}
      {/*                    linkViewsEnabled ? "translate-x-6" : "translate-x-0.5"*/}
      {/*                }`}*/}
      {/*            />*/}
      {/*        </div>*/}
      {/*    </Button>*/}
      {/*</div>*/}
    </div>
  );
};

export default HeaderSection;
