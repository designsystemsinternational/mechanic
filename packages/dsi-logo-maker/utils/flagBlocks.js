// Predetermined sets of color distributions
// min: quarter line
// max: entire line
const colorDistributions = [
  [0.75, 0.5, 0.75],
  [0.5, 0.75, 0.75],
  [0.5, 0.5, 1],
  [0.75, 0.75, 0.5],
  [0.75, 0.25, 1],
  [0.5, 1, 0.5],
  [0.375, 0.875, 0.75],
  [0.75, 0.375, 0.875]
];

const offsets = [-0.5, -0.375, -0.25, 0, 0.25, 0.375, 0.5];
const pickItemBySeed = (arr, n) => arr[n % arr.length];

export const buildBlocks = ({
  width = 620,
  height = 370,
  seedDistribution = 0,
  seedOffset = 0,
  colors
}) => {
  const colorDistribution = pickItemBySeed(
    colorDistributions,
    seedDistribution
  ).map(d => d * width);

  const offset = pickItemBySeed(offsets, seedOffset) * width;

  // TODO: Refactor to be more functional and have less side effects
  const blocks = () => {
    let x = offset;
    let y = 0;

    const blocks = [];

    const buildBlock = (_x, _y, _w, color) => {
      const x = _x < 0 ? _x + width : _x;
      const y = _x < 0 ? _y + height / 2 : _y;
      const remainder = x + _w - width;
      const w = remainder > 0 ? _w - remainder : _w;

      blocks.push({ x, y, w, h: height / 2, color });

      if (remainder > 0) {
        // If there is a remainder it's safe to set x to 0
        return buildBlock(0, y > 0 ? 0 : height / 2, remainder, color);
      } else {
        return {
          x: x + w,
          y
        };
      }
    };

    for (let i = 0; i < colorDistribution.length; i++) {
      const item = colorDistribution[i];
      const result = buildBlock(x, y, item, colors[i].background);
      x = result.x;
      y = result.y;
    }

    return blocks;
  };

  return blocks();
};
