import { type ReactNode } from "react";

interface OverviewCardComponentProps {
  title: string;
  children: ReactNode;
}

export default function OverviewCardComponent({
                                                  title,
                                                  children,
                                              }: OverviewCardComponentProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm w-full">
            <div className="flex items-start gap-2 text-sm text-gray-700">
                <div className="flex flex-wrap">
                    <div className="text-sm text-gray-700 pl-1">
                        <span className="text-sm font-semibold text-gray-900 mr-1 inline">{title}:</span>
                        <span className="inline">{children}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
