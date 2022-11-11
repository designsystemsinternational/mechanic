export const stringToSeed = str => {
  return str.length === 0
    ? 0
    : str
        .split("")
        .map(c => c.charCodeAt())
        .reduce((a, b) => a + b);
};

export const buildSeeds = (
  seedMode,
  text,
  { seedForOffset, seedForDistribution }
) => {
  if (seedMode === "From Text") {
    return {
      seedDistribution: stringToSeed(text),
      seedOffset: text.length
    };
  } else {
    return {
      seedDistribution: seedForDistribution,
      seedOffset: seedForOffset
    };
  }
};
