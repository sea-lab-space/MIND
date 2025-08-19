import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import * as d3 from "d3";
import { useWindowSize } from "react-use";

type DateItem = {
  date: Date | string;
  label?: string;
  color?: string;
};

type VerticalTimelineProps = {
  dates: DateItem[];
  onStateChange?: (range: [Date, Date] | null) => void;
  fontSize?: number;
  fontColor?: string;
  leftPadding?: number;
};

type VerticalTimelineHandle = {
  getState: () => { range: [Date, Date] | null };
  setRange: (r: [Date | string, Date | string] | null) => void;
  setDate: (d: Date | string) => void;
  clear: () => void;
};

// Define a new type for the timeline segments
type Segment = {
  key: string | number;
  start: Date;
  end: Date;
};

const parseMaybeDate = (d: Date | string | null) =>
  d == null
    ? null
    : d instanceof Date
    ? d
    : d3.timeParse("%Y-%m-%d")(d as string);

const VerticalTimeline = forwardRef<
  VerticalTimelineHandle,
  VerticalTimelineProps
>(function VerticalTimeline(
  {
    dates,
    onStateChange,
    fontSize = 12,
    fontColor = "text-black",
    leftPadding = 80,
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { width: triggerWidth, height: triggerHeight } = useWindowSize();
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      setContainerSize({ width: clientWidth, height: clientHeight });
    }
  }, [triggerWidth, triggerHeight]);

  const width = containerSize.width;
  const height = containerSize.height;

  const parsedDates = useMemo(
    () =>
      dates
        .map((d) => ({
          ...d,
          date:
            d.date instanceof Date
              ? d.date
              : d3.timeParse("%Y-%m-%d")(d.date as string)!,
        }))
        .sort((a, b) => +a.date - +b.date),
    [dates]
  );

  const [range, setRange] = useState<[Date, Date] | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [hoveredSegment, setHoveredSegment] = useState<number | string | null>(
    null
  );

  const shuffleMargin = 10;
  const margin = { top: 16, right: 64, bottom: 30, left: leftPadding };

  const domain = useMemo(() => {
    if (parsedDates.length === 0) {
      const now = d3.timeDay.offset(new Date(), -1);
      return [now, d3.timeDay.offset(now, 2)];
    }
    const firstDate = parsedDates[0].date;
    const lastDate = parsedDates[parsedDates.length - 1].date;
    const offset = (lastDate.getTime() - firstDate.getTime()) * 0.90;
    return [
      d3.timeDay.offset(firstDate, -Math.ceil(offset / (24 * 60 * 60 * 1000))),
      lastDate,
    ];
  }, [parsedDates]);

  const yScale = useMemo(
    () =>
      d3
        .scaleTime()
        .domain(domain as [Date, Date])
        .range([
          margin.top,
          Math.max(1, height - margin.top - margin.bottom) + margin.top,
        ]),
    [domain, height, margin.top, margin.bottom]
  );

  const handleSelectRange = (start: Date, end: Date) => {
    setRange([start, end]);
  };

  const handleSelectDate = (d: Date) => {
    setRange([d, d]);
  };

  useEffect(() => {
    onStateChange?.(range);
  }, [range, onStateChange]);

  useImperativeHandle(ref, () => ({
    getState: () => ({ range }),
    setRange: (r) => {
      if (!r) {
        setRange(null);
        return;
      }
      const lo = parseMaybeDate(r[0]);
      const hi = parseMaybeDate(r[1]);
      if (!lo || !hi) return;
      const [a, b] =
        d3.timeDay.floor(lo) <= d3.timeDay.floor(hi) ? [lo, hi] : [hi, lo];
      setRange([a, b]);
    },
    setDate: (d) => {
      const date = parseMaybeDate(d);
      if (!date) return;
      setRange([date, date]);
    },
    clear: () => {
      setRange(null);
    },
  }));

  const isSelected = (start: Date, end: Date) =>
    range &&
    +d3.timeDay.floor(range[0]) === +d3.timeDay.floor(start) &&
    +d3.timeDay.floor(range[1]) === +d3.timeDay.floor(end);
  const isDateSelected = (d: Date) =>
    range &&
    +d3.timeDay.floor(range[0]) === +d3.timeDay.floor(d) &&
    +d3.timeDay.floor(range[1]) === +d3.timeDay.floor(d);

  const segments = useMemo(() => {
    const segmentsArray: Segment[] = [];
    if (parsedDates.length > 0) {
      segmentsArray.push({
        key: "pre-trailing",
        start: domain[0],
        end: parsedDates[0].date,
      });
      for (let i = 0; i < parsedDates.length - 1; i++) {
        segmentsArray.push({
          key: i,
          start: parsedDates[i].date,
          end: parsedDates[i + 1].date,
        });
      }
    }
    return segmentsArray;
  }, [parsedDates, domain]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <svg className="w-full h-full absolute top-0 left-0 overflow-visible select-none z-10">
        {/* Main Axis Line */}
        {parsedDates.length > 0 && (
          <line
            x1={leftPadding}
            y1={yScale(domain[0])} // Line starts at the beginning of the domain
            x2={leftPadding}
            y2={yScale(parsedDates[parsedDates.length - 1].date)}
            stroke="#000"
            strokeWidth={1}
          />
        )}

        {/* Y-Axis Ticks: Drawn at the exact dates from the input */}
        {parsedDates.map((d, i) => {
          const centerX = leftPadding;
          const yy = yScale(d.date);
          return (
            <g key={`tick-${i}`} transform={`translate(${centerX}, ${yy})`}>
              {/* Tick line */}
              <line
                x1={-5}
                x2={0}
                y1={0}
                y2={0}
                stroke="#000"
                strokeWidth={1}
              />
              {/* Tick label */}
              <text
                x={-8}
                y={0}
                fontSize={fontSize}
                fill={fontColor}
                textAnchor="end"
                alignmentBaseline="middle"
              >
                {d3.timeFormat("%Y-%m-%d")(d.date)}
              </text>
            </g>
          );
        })}

        {/* Timeline segments as a single set of clickable rects */}
        {segments.map((seg, i) => {
          const yStart = yScale(seg.start);
          const yEnd = yScale(seg.end);
          const selected = isSelected(seg.start, seg.end);

          return (
            <rect
              key={`seg-${seg.key}`}
              x={margin.left}
              y={i === 0 ? yStart : yStart + 10}
              width={width - margin.right}
              height={i === 0 ? yEnd - yStart - 10 : yEnd - yStart - 20}
              className={`transition-opacity cursor-pointer ${
                selected
                  ? "fill-gray-200 opacity-100"
                  : hoveredSegment === seg.key
                  ? "fill-gray-200 opacity-70"
                  : "fill-transparent"
              }`}
              onClick={() => handleSelectRange(seg.start, seg.end)}
              onMouseEnter={() => setHoveredSegment(seg.key)}
              onMouseLeave={() => setHoveredSegment(null)}
            />
          );
        })}

        {/* Individual date clickable rects */}
        {parsedDates.map((d, i) => {
          const yy = yScale(d.date);
          const selected = isDateSelected(d.date);
          return (
              <g key={`date-row-${i}`} onClick={() => handleSelectDate(d.date)}>
                {/* Vertical marker line */}
                <line
                    x1={margin.left - 8}
                    x2={margin.left}
                    y1={yy}
                    y2={yy}
                    stroke="#000"
                    strokeWidth={2}
                />

                {/* Highlight rect (clickable zone) */}
                <rect
                    x={margin.left + 10}
                    y={yy - 10}
                    width={width - margin.right}
                    height={40}
                    rx={4}
                    ry={4}
                    className={`cursor-pointer transition ${
                        selected
                            ? "fill-blue-100"
                            : hovered === i
                                ? "fill-gray-200"
                                : "fill-transparent"
                    }`}
                    stroke="#000"         // border color
                    strokeWidth={1.5}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                />
              </g>
          );
        })}
      </svg>
      {/* Dates labels rendered with native HTML, placed behind the SVG */}
      {parsedDates.map((d, i) => {
        const yy = yScale(d.date);
        return (
          <div
            key={`html-label-${i}`}
            className="absolute pointer-events-none z-10"
            style={{
              top: yy,
              left: leftPadding + shuffleMargin,
              fontSize: fontSize,
              color: fontColor,
              transform: "translateY(-50%)",
            }}
          >
            {d.label}
          </div>
        );
      })}
    </div>
  );
});

export default VerticalTimeline;
