import type { DataPoint } from "@/types/insightSpec";
import { dateBetween } from "./dateHelper";

export const calcAverageBetweenDate = (
  data: DataPoint[],
  time_start: string,
  time_end: string,
  metricKey: string
) => {
  const { sum, count } = data.reduce(
    (acc, curr) => {
      if (dateBetween(curr.date, time_start, time_end) === true && curr[metricKey] !== null) {
        acc.sum += curr[metricKey] as number;
        acc.count += 1;
        return acc;
      } else {
        return acc;
      }
    },
    { sum: 0, count: 0 }
  );

  if (count !== 0)
    return sum / count;
  else
    return 0;
};



export const getUpperLimitScale = (yRangeMax: number) => {
  let adjustedMax = yRangeMax;
  let tickBreakUnit = 1;

  if (yRangeMax < 5) {
    adjustedMax = yRangeMax;
    tickBreakUnit = 1;
  } else if (yRangeMax < 10) {
    adjustedMax = Math.ceil(yRangeMax / 2) * 2;
    tickBreakUnit = 2;
  } else if (yRangeMax < 50) {
    adjustedMax = Math.ceil(yRangeMax / 5) * 5;
    tickBreakUnit = 5;
  } else if (yRangeMax < 100) {
    adjustedMax = Math.ceil(yRangeMax / 10) * 10;
    tickBreakUnit = 10;
  } else if (yRangeMax < 500) {
    adjustedMax = Math.ceil(yRangeMax / 50) * 50;
    tickBreakUnit = 50;
  } else if (yRangeMax < 1000) {
    adjustedMax = Math.ceil(yRangeMax / 100) * 100;
    tickBreakUnit = 100;
  } else if (yRangeMax < 5000) {
    adjustedMax = Math.ceil(yRangeMax / 500) * 500;
    tickBreakUnit = 500;
  } else if (yRangeMax < 10000) {
    adjustedMax = Math.ceil(yRangeMax / 1000) * 1000;
    tickBreakUnit = 1000;
  } else {
    adjustedMax = Math.ceil(yRangeMax);
    tickBreakUnit = Math.ceil(yRangeMax / 10); // optional fallback
  }

  return {
    yRangeUse: adjustedMax,
    tickBreakUnit,
  };
};