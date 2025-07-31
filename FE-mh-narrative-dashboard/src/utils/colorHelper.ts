import {
  color as d3color,
  hsl as d3hsl,
  type Color,
} from "d3";

export const getColors = (themeColor: string) => {
  const d3ThemeColor = d3color(themeColor);
  const baseColor = d3ThemeColor?.formatHex() ?? "#8c92b8";
  const highlightColor = "#ba1e30ff";
  return { baseColor, highlightColor };
};

function getComplementaryColor(c: Color): string {
  const hslColor = d3hsl(c);
  hslColor.h = (hslColor.h + 180) % 360;
  const colorHex = hslColor.formatHex();
  if (colorHex !== null)
    return colorHex;
  return "#ffffff";
}

export const HIGHLIGHT_FILL_OPACITY = 0.3
