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
    date: string;
    label: string;
};

type VerticalTimelineProps = {
    dates: TimelineDate[];
    onStateChange?: (selected: string | null) => void;
};

export const VerticalTimeline = forwardRef<HTMLDivElement, VerticalTimelineProps>(
    ({ dates, onStateChange }, ref) => {
        const svgRef = useRef<SVGSVGElement | null>(null);
        const containerRef = useRef<HTMLDivElement | null>(null);
        const { height: windowHeight } = useWindowSize();
        const [selected, setSelected] = useState<string | null>(null);

        useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

        useEffect(() => {
            if (!svgRef.current || !containerRef.current || dates.length < 2)
              return;

            const svg = d3.select(svgRef.current);
            svg.selectAll("*").remove(); // clear previous render

            const margin = { top: 30, right: 80, bottom: 30, left: 60 };
            const width = 200;
            const parent = containerRef.current.parentElement;
            if (!parent) return;
            
            const parentHeight = parent.clientHeight;

            const svgHeight = parentHeight; 

            svg.attr("width", width).attr("height", svgHeight);

            const availableHeight = svgHeight - margin.top - margin.bottom;

            const yScale = d3
                .scalePoint<string>()
                .domain(dates.map((d) => d.date))
                .range([margin.top, svgHeight - margin.bottom -200])
                .padding(0); // Remove padding to start from top

            const centerX = width / 2;

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

            const updateAllButtonBackgrounds = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, selectedValue: string | null) => {
                svg
                  .selectAll<HTMLButtonElement, unknown>(
                    "foreignObject[data-date] button"
                  )
                  .style("background", function () {
                    const parentFO = d3.select(this.parentNode as Element);
                    const buttonDate = parentFO.attr("data-date");
                    return selectedValue === buttonDate ? "lightgrey" : "white";
                  });

                svg.selectAll("foreignObject[data-option='history'] button")
                    .style("background", selectedValue === "history" ? "lightgrey" : "white");

                svg.selectAll("foreignObject[data-option='insights'] button")
                    .style("background", selectedValue === "insights" ? "lightgrey" : "white");
            };

            dates.forEach((d, _) => {
                const y = yScale(d.date)!;

                svg
                    .append("text")
                    .attr("x", centerX - 20)
                    .attr("y", y + 4)
                    .attr("text-anchor", "end")
                    .text(d.date)
                    .style("font-size", "10px")
                    .style("fill", "#333");

                svg
                    .append("circle")
                    .attr("cx", centerX)
                    .attr("cy", y)
                    .attr("r", 5)
                    .attr("fill", "lightgrey")
                    .attr("stroke", "black")
                    .attr("stroke-width", 1);

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
                        const newSelected = selected === d.date ? null : d.date;
                        setSelected(newSelected);
                        onStateChange?.(newSelected);

                        // Update all button backgrounds immediately
                        updateAllButtonBackgrounds(svg, newSelected);
                    });

                btn.text(d.label);
            });

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