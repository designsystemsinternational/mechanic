const options = [
  {
    name: "Poster Generator",
    type: "Canvas",
    dir: "poster-generator",
  },
  {
    name: "Vanilla JS Image",
    type: "SVG",
    dir: "svg-image",
  },
  {
    name: "Vanilla JS Animation",
    type: "SVG",
    dir: "svg-video",
  },
  {
    name: "Vanilla JS Image",
    type: "Canvas",
    dir: "canvas-image",
  },
  {
    name: "Vanilla JS Animation",
    type: "Canvas",
    dir: "canvas-video",
  },
  {
    name: "Random Vanilla JS Image",
    type: "Canvas",
    dir: "random-image",
  },
  {
    name: "React Image",
    type: "SVG",
    dir: "react-image",
  },
  {
    name: "React Animation",
    type: "SVG",
    dir: "react-video",
  },
  {
    name: "p5.js Animation",
    type: "Canvas",
    dir: "p5-animation",
  },
];

module.exports = options.reduce((acc, cur) => {
  acc[cur.dir] = cur;
  return acc;
}, {});
