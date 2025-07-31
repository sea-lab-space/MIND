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
