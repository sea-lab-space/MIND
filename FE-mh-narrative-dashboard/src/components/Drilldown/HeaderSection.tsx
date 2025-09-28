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
        <h1
          className="text-xl font-semibold text-[#1e1e1e]"
          style={{
            wordBreak: "break-word",
            overflowWrap: "break-word",
            hyphens: "auto",
          }}
          dangerouslySetInnerHTML={{
            __html: title,
          }}
        ></h1>
      </div>
      <div>
        <Button variant="outline" onClick={onClick}>
          <X />
        </Button>
      </div>
    </div>
  );
};

export default HeaderSection;
