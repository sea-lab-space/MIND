import { ReactNode } from "react";

interface OverviewCardComponentProps {
    icon ;
    title: string;
    children: ReactNode;
    isExpanded: boolean;
}

export default function OverviewCardComponent({
                                                  icon: Icon,
                                                  title,
                                                  children,
                                              }: OverviewCardComponentProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm w-full">
            <div className="flex items-start gap-2 text-sm text-gray-700">
                <Icon className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" />
                <div className="flex flex-wrap">
                    <div className="text-sm text-gray-700">
                        <span className="font-semibold text-gray-900 mr-1 inline">{title}:</span>
                        <span className="inline">{children}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
