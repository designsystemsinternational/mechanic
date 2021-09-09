const options = [
  {
    name: "Vanilla JS Image",
    type: "Canvas",
    dir: "canvas-image",
  },
  {
    name: "Vanilla JS Video",
    type: "Canvas",
    dir: "canvas-video",
  },
  {
    name: "Vanilla JS Image",
    type: "SVG",
    dir: "svg-image",
  },
  {
    name: "Vanilla JS Video",
    type: "SVG",
    dir: "svg-video",
  },
  {
    name: "p5.js Image",
    type: "Canvas",
    dir: "p5-image",
  },
  {
    name: "p5.js Video",
    type: "Canvas",
    dir: "p5-video",
  },
  {
    name: "React Image",
    type: "SVG",
    dir: "react-image",
  },
  {
    name: "React Video",
    type: "SVG",
    dir: "react-video",
  },
];

module.exports = options.reduce((acc, cur) => {
  acc[cur.dir] = cur;
  return acc;
}, {});
