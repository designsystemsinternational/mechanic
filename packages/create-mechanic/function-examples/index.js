const options = [
  {
    name: "Poster Generator",
    type: "Canvas",
    dir: "poster-generator",
  },
];

module.exports = options.reduce((acc, cur) => {
  acc[cur.dir] = cur;
  return acc;
}, {});
