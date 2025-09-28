import { useRef, useState, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { HomePageTabKey, TabItem, TabKey } from "@/types/dataTypes";

type TabsViewProps = {
    tabItems: TabItem[];
    defaultTab: TabKey | HomePageTabKey;
    isMIND?: boolean;
};

export default function TabsView({ tabItems, defaultTab, isMIND = true }: TabsViewProps) {
    const [activeTab, setActiveTab] = useState<TabKey | HomePageTabKey>(defaultTab);
    const scrollPositions = useRef<
      Partial<Record<TabKey | HomePageTabKey, number>>
    >({});
    const contentRef = useRef<HTMLDivElement>(null);

    const handleTabChange = useCallback(
      (val: string) => {
        const tabKey = val as TabKey;
        if (contentRef.current) {
          scrollPositions.current[activeTab] = contentRef.current.scrollTop;
        }
        setActiveTab(tabKey);
        setTimeout(() => {
          if (contentRef.current) {
            contentRef.current.scrollTop = scrollPositions.current[val] || 0;
          }
        }, 0);
      },
      [activeTab]
    );

    return (
        <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full flex flex-col flex-1 min-h-0"
        >
            <div className="sticky top-0 z-10 px-4 bg-white">
                <TabsList
                    className={`grid gap-2 w-full ${
                        isMIND ? "[grid-template-columns:35%_repeat(4,1fr)]" : "[grid-template-columns:35%_repeat(4,1fr)]" // "grid-cols-5"
                    }`}
                >
                    {tabItems.map((tab) => (
                        <TabsTrigger key={tab.key} value={tab.key}>
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>

            <div ref={contentRef} className="flex-1 min-h-0 overflow-y-auto">
                {tabItems.map((tab) => (
                    <TabsContent key={tab.key} value={tab.key} className="h-full">
                        {tab.component}
                    </TabsContent>
                ))}
            </div>
        </Tabs>
    );
}
