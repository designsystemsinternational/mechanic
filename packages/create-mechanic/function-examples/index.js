const options = [
  {
    name: "Business Card Generator",
    type: "SVG",
    dir: "business-card-generator"
  },
  {
    name: "Instagram Story Generator",
    type: "SVG",
    dir: "instagram-story-generator"
  },
  {
    name: "Poster Generator",
    type: "Canvas",
    dir: "poster-generator"
  },
  {
    name: "Adaptive Grid",
    type: "SVG",
    dir: "adaptive-grid"
  }
];

module.exports = options.reduce((acc, cur) => {
  acc[cur.dir] = cur;
  return acc;
}, {});
