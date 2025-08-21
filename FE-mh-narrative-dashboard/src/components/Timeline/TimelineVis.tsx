import React, {
    useEffect,
    useRef,
    useState,
    forwardRef,
    useImperativeHandle,
} from "react";
import * as d3 from "d3";
import { useWindowSize } from "react-use";

type TimelineDate = {
    date: string; // "YYYY-MM-DD"
    label: string; // e.g., "Last session", "Today"
};

type VerticalTimelineProps = {
    dates: TimelineDate[];
    onStateChange?: (selected: string | null) => void;
};

export const VerticalTimeline = forwardRef<HTMLDivElement, VerticalTimelineProps>(
    ({ dates, onStateChange }, ref) => {
        // ===== Refs & state =====
        const svgRef = useRef<SVGSVGElement | null>(null);
        const containerRef = useRef<HTMLDivElement | null>(null);
        const { height: windowHeight } = useWindowSize();
        const [selected, setSelected] = useState<string | null>(null);
        // Remove individual states for insights and history since we're using single selection
        // const [showInsights, setShowInsights] = useState(false);
        // const [showHistory, setShowHistory] = useState(false);

        // Expose container div to parent via ref (matches your original API)
        useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

        useEffect(() => {
            if (!svgRef.current || !containerRef.current || dates.length < 2)
              return;

            // ===== Setup & sizing =====
            const svg = d3.select(svgRef.current);
            svg.selectAll("*").remove(); // clear previous render

            // Compact margins; width fixed at 200; height = 50% of screen
            const margin = { top: 30, right: 80, bottom: 30, left: 60 };
            const width = 200;
            const parent = containerRef.current.parentElement;
            if (!parent) return;
            
            const parentHeight = parent.clientHeight;

            const svgHeight = parentHeight; 

            svg.attr("width", width).attr("height", svgHeight);

            // Calculate available space for points
            const availableHeight = svgHeight - margin.top - margin.bottom;

            // Create y scale that starts from the very top of available space
            const yScale = d3
                .scalePoint<string>()
                .domain(dates.map((d) => d.date))
                .range([margin.top, svgHeight - margin.bottom -200])
                .padding(0); // Remove padding to start from top

            const centerX = width / 2;

            // ===== Extended main vertical line =====
            // Extend the line above the first point and beyond the last point
            const firstY = yScale(dates[0].date)!;
            const lastY = yScale(dates[dates.length - 1].date)!;
            const extensionLength = 25; // pixels to extend

            svg
                .append("line")
                .attr("x1", centerX)
                .attr("x2", centerX)
                .attr("y1", firstY - extensionLength) // Start above first point
                .attr("y2", lastY + extensionLength)  // End below last point
                .attr("stroke", "black")
                .attr("stroke-width", 2);

            // ===== History button above first date =====
            // const historyBtnY = firstY - extensionLength + 5; // Position near top of extended line
            //
            // const historyBtn = svg
            //     .append("foreignObject")
            //     .attr("x", centerX + 10)
            //     .attr("y", historyBtnY - 12)
            //     .attr("width", 80)
            //     .attr("height", 24)
            //     .attr("data-option", "history")
            //     .append("xhtml:button")
            //     .style("width", "100%")
            //     .style("height", "24px")
            //     .style("font-size", "10px")
            //     .style("border", "1px solid #ccc")
            //     .style("border-radius", "6px")
            //     .style("background", selected === "history" ? "lightgrey" : "white")
            //     .style("cursor", "pointer")
            //     .on("mouseenter", function () {
            //         if (selected !== "history") d3.select(this).style("background", "#eee");
            //     })
            //     .on("mouseleave", function () {
            //         if (selected !== "history") d3.select(this).style("background", "white");
            //     })
            //     .on("click", () => {
            //         const newSelected = selected === "history" ? null : "history";
            //         setSelected(newSelected);
            //         onStateChange?.(newSelected);
            //
            //         // Update all button backgrounds immediately
            //         updateAllButtonBackgrounds(svg, newSelected);
            //     });
            //
            // historyBtn.text("History");
            //
            // // ===== Grey highlight above first session when "History" is active =====
            // if (selected === "history") {
            //     svg
            //         .append("line")
            //         .attr("x1", centerX)
            //         .attr("x2", centerX)
            //         .attr("y1", firstY - extensionLength)
            //         .attr("y2", firstY)
            //         .attr("stroke", "grey")
            //         .attr("stroke-width", 6)
            //         .attr("opacity", 0.6);
            // }

            // Helper function to update all button backgrounds
            const updateAllButtonBackgrounds = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, selectedValue: string | null) => {
                // Update date buttons
                svg
                  .selectAll<HTMLButtonElement, unknown>(
                    "foreignObject[data-date] button"
                  )
                  .style("background", function () {
                    const parentFO = d3.select(this.parentNode as Element);
                    const buttonDate = parentFO.attr("data-date");
                    return selectedValue === buttonDate ? "lightgrey" : "white";
                  });

                // Update history button
                svg.selectAll("foreignObject[data-option='history'] button")
                    .style("background", selectedValue === "history" ? "lightgrey" : "white");

                // Update insights button
                svg.selectAll("foreignObject[data-option='insights'] button")
                    .style("background", selectedValue === "insights" ? "lightgrey" : "white");
            };

            // ===== Render each date row =====
            dates.forEach((d, index) => {
                const y = yScale(d.date)!;

                // Left-side date text (smaller font)
                svg
                    .append("text")
                    .attr("x", centerX - 20)
                    .attr("y", y + 4)
                    .attr("text-anchor", "end")
                    .text(d.date)
                    .style("font-size", "10px")
                    .style("fill", "#333");

                // Dot on the line
                svg
                    .append("circle")
                    .attr("cx", centerX)
                    .attr("cy", y)
                    .attr("r", 5)
                    .attr("fill", "lightgrey")
                    .attr("stroke", "black")
                    .attr("stroke-width", 1);

                // Right-side button (hover grey, active grey)
                const btn = svg
                    .append("foreignObject")
                    .attr("x", centerX + 10)
                    .attr("y", y - 12)
                    .attr("width", 80)
                    .attr("height", 24)
                    .attr("data-date", d.date) // Add data attribute for identification
                    .append("xhtml:button")
                    .style("width", "100%")
                    .style("height", "24px")
                    .style("font-size", "10px")
                    .style("border", "1px solid #ccc")
                    .style("border-radius", "6px")
                    .style("background", selected === d.date ? "lightgrey" : "white")
                    .style("cursor", "pointer")
                    .on("mouseenter", function () {
                        if (selected !== d.date) d3.select(this).style("background", "#eee");
                    })
                    .on("mouseleave", function () {
                        if (selected !== d.date) d3.select(this).style("background", "white");
                    })
                    .on("click", function () {
                        // Single selection logic: if clicking current selection, deselect; otherwise select this one
                        const newSelected = selected === d.date ? null : d.date;
                        setSelected(newSelected);
                        onStateChange?.(newSelected);

                        // Update all button backgrounds immediately
                        updateAllButtonBackgrounds(svg, newSelected);
                    });

                btn.text(d.label);
            });

            // ===== Middle "Data Insights" button (between first & last) =====
            const midY = (firstY + lastY) / 2;

            const insightsBtn = svg
                .append("foreignObject")
                .attr("x", centerX + 10)
                .attr("y", midY - 12)
                .attr("width", 80)
                .attr("height", 24)
                .attr("data-option", "insights")
                .append("xhtml:button")
                .style("width", "100%")
                .style("height", "24px")
                .style("font-size", "10px")
                .style("border", "1px solid #ccc")
                .style("border-radius", "6px")
                .style("background", selected === "insights" ? "lightgrey" : "white")
                .style("cursor", "pointer")
                .on("mouseenter", function () {
                    if (selected !== "insights") d3.select(this).style("background", "#eee");
                })
                .on("mouseleave", function () {
                    if (selected !== "insights") d3.select(this).style("background", "white");
                })
                .on("click", () => {
                    const newSelected = selected === "insights" ? null : "insights";
                    setSelected(newSelected);
                    onStateChange?.(newSelected);

                    // Update all button backgrounds immediately
                    updateAllButtonBackgrounds(svg, newSelected);
                });

            insightsBtn.text("Insights");

            // ===== Grey highlight segment when "Insights" is active =====
            if (selected === "insights") {
                svg
                    .append("line")
                    .attr("x1", centerX)
                    .attr("x2", centerX)
                    .attr("y1", firstY)
                    .attr("y2", lastY)
                    .attr("stroke", "grey")
                    .attr("stroke-width", 6)
                    .attr("opacity", 0.6);
            }
        }, [dates, selected, windowHeight, onStateChange]);

        return (
            <div ref={containerRef}>
                <svg ref={svgRef}></svg>
            </div>
        );
    }
);

export default VerticalTimeline;