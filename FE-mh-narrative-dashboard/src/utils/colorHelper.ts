import {
  color as d3color,
} from "d3";

export const HIGHLIGHT_COLOR = "#D13808";
export const PASSIVE_SENSING_COLOR = "#8c92b8bd";
export const SURVEY_COLOR = "#eeb311d1"

export const getColors = (themeColor: string) => {
  const d3ThemeColor = d3color(themeColor);
  const baseColor = d3ThemeColor?.formatHex() ?? "#8c92b8";
  const highlightColor = HIGHLIGHT_COLOR;
  return { baseColor, highlightColor };
};


export const HIGHLIGHT_FILL_OPACITY = 0.3

export const MAX_BAR_SIZE = 8
