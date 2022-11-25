import * as d3 from "d3";

export const handler = ({ inputs, mechanic }) => {
  const { width, height, text, color1, color2, radiusPercentage } = inputs;

  const center = [width / 2, height / 2];
  const radius = ((height / 2) * radiusPercentage) / 100;
  const angle = Math.random() * 360;

  const SVG = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  const arc1 = d3
    .arc()
    .innerRadius(0)
    .outerRadius(radius)
    .startAngle(0)
    .endAngle((2 * Math.PI) / 2);

  const arc2 = d3
    .arc()
    .innerRadius(0)
    .outerRadius(radius)
    .startAngle((2 * Math.PI) / 2)
    .endAngle((4 * Math.PI) / 2);

  SVG.append("path")
    .attr("transform", `translate(${center[0]},${center[1]}), rotate(${angle})`)
    .attr("d", arc1)
    .attr("fill", color1);

  SVG.append("path")
    .attr("transform", `translate(${center[0]},${center[1]}), rotate(${angle})`)
    .attr("d", arc2)
    .attr("fill", color2);

  SVG.append("text")
    .attr("transform", `translate(${center[0]}, ${height - height / 20})`)
    .style("text-anchor", "middle")
    .style("font-size", height / 10)
    .style("font-family", "sans-serif")
    .text(text);

  mechanic.done(SVG._groups[0][0].outerHTML);
};

export const inputs = {
  width: {
    type: "number",
    default: 400
  },
  height: {
    type: "number",
    default: 300
  },
  text: {
    type: "text",
    default: "mechanic"
  },
  color1: {
    type: "color",
    model: "hex",
    default: "#E94225"
  },
  color2: {
    type: "color",
    model: "hex",
    default: "#002EBB"
  },
  radiusPercentage: {
    type: "number",
    default: 40,
    min: 0,
    max: 100,
    slider: true
  }
};

export const presets = {
  medium: {
    width: 800,
    height: 600
  },
  large: {
    width: 1600,
    height: 1200
  }
};

export const settings = {
  engine: require("@mechanic-design/engine-svg")
};
