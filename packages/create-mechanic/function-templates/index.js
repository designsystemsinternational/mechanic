const options = [
  {
    name: "Vanilla JS SVG",
    type: "SVG",
    dir: "svg",
  },
  {
    name: "Vanilla JS Canvas",
    type: "Canvas",
    dir: "canvas",
  },
  {
    name: "React",
    type: "SVG",
    dir: "react",
  },
  {
    name: "p5.js Animation",
    type: "Canvas",
    dir: "p5",
  },
];

module.exports = options.reduce((acc, cur) => {
  acc[cur.dir] = cur;
  return acc;
}, {});
