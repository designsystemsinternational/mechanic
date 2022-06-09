import { SVG, extend as SVGextend, Element as SVGElement } from '@svgdotjs/svg.js'

export const handler = ({ inputs, mechanic }) => {
  const { width, height, text, color1, color2, radiusPercentage } = inputs;

  const center = [width / 2, height / 2];
  const radius = Math.max(radiusPercentage / 100, 0.1);
  const angle = Math.random() * 360;

  let draw = SVG().size(width, height)
  , rawSVG = '<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90" ><defs></defs><path class="cls-1" d="M90,45A45,45,0,0,0,0,45Z"/></svg>'
  , arcGroup = draw.group()
  , arc1 = arcGroup.group().svg(rawSVG)
  , arc2 = arcGroup.group().svg(rawSVG)
  , textBox = draw.text(text)

  arc1.scale(radius).css({fill: color1})
  arc2.scale(radius).rotate(180, center).css({fill: color2})
  arcGroup.move(center[0] - center[0]*radius, center[1] - center[1]*radius).rotate(angle)

  textBox.move(center[0], height - height/20)
  .font({ family: 'sans-serif', size: 36, anchor: 'middle'})
  .fill({ color: '#000' })
  .font({ size: 36 })

  mechanic.done(draw.node.outerHTML);
};

export const inputs = {
  width: {
    type: "number",
    default: 400,
  },
  height: {
    type: "number",
    default: 300,
  },
  text: {
    type: "text",
    default: "mechanic",
  },
  color1: {
    type: "color",
    model: "hex",
    default: "#E94225",
  },
  color2: {
    type: "color",
    model: "hex",
    default: "#002EBB",
  },
  radiusPercentage: {
    type: "number",
    default: 40,
    min: 0,
    max: 100,
    slider: true,
  },
};

export const presets = {
  medium: {
    width: 800,
    height: 600,
  },
  large: {
    width: 1600,
    height: 1200,
  },
};

export const settings = {
  engine: require("@mechanic-design/engine-svg"),
};
