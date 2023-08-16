import React, { useEffect } from "react";
import {
  computeBaseBricks,
  computeBlockGeometry,
  precomputeBlocks,
  getIndexModule
} from "../../utils/blocks";
import { useLoadedOpentypeFont } from "../../utils/hooks";
import { Block } from "../../utils/blocks-components";
import { greys } from "../../utils/graphics";

function shuffle(array) {
  const newArray = [...array];
  let currentIndex = newArray.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex],
      newArray[currentIndex]
    ];
  }

  return newArray;
}

function chooseRandom(array, k) {
  const options = [...array];
  const choices = [];
  for (let i = 0; i < k; i++) {
    const elementIndex = Math.floor(Math.random() * options.length);
    choices.push(options[elementIndex]);
    options.splice(elementIndex, 1);
  }
  return choices;
}

export const handler = ({ inputs, mechanic }) => {
  const {
    width,
    height,
    logoWidth,
    logoRatio,
    fontMode,
    randomizeColors,
    consistentSet,
    firstColor,
    secondColor,
    thirdColor,
    randomizeColorOrder
  } = inputs;
  const { done } = mechanic;

  const rows = 2;
  const cols = 13;
  const logoHeight = Math.floor((logoWidth / logoRatio) * rows);
  const words = ["DESIGN", "SYSTEMS", "INTERNATIONAL"];
  const font = useLoadedOpentypeFont(fontMode);

  useEffect(() => {
    if (font) {
      done();
    }
  }, [font]);

  if (!font) {
    return null;
  }

  const blockGeometry = computeBlockGeometry(logoWidth, logoHeight, rows, cols);
  const baseBricks = computeBaseBricks(words, blockGeometry.fontSize, font);
  const blocksByIndex = precomputeBlocks(blockGeometry, baseBricks);

  const blockConfigs = [];
  let position = { x: 0, y: 0 };
  let colors = randomizeColors
    ? chooseRandom(Object.values(greys), 3)
    : [greys[firstColor], greys[secondColor], greys[thirdColor]];
  let brickOffset = 0;

  while (position.y < height) {
    const block =
      blocksByIndex[getIndexModule(brickOffset, blocksByIndex.length)];
    blockConfigs.push({ position, block, colors });
    position = { ...position };
    if (position.x + block.width < width) {
      position.x += block.width;
      brickOffset++;
      if (!consistentSet) colors = chooseRandom(Object.values(greys), 3);
      else if (randomizeColorOrder) colors = shuffle(colors);
    } else {
      position.x = position.x - width;
      position.y += block.height;
    }
  }

  return (
    <svg width={width} height={height}>
      {blockConfigs.map(({ position, block, colors }) => (
        <Block
          key={`${position.x}-${position.y}`}
          position={position}
          block={block}
          colors={colors}
        ></Block>
      ))}
    </svg>
  );
};

export const inputs = {
  width: {
    type: "number",
    default: 1920,
    min: 100
  },
  height: {
    type: "number",
    default: 1080,
    min: 100
  },
  logoWidth: {
    type: "number",
    default: 300,
    min: 10
  },
  logoRatio: {
    type: "number",
    default: 9,
    max: 20,
    slider: true,
    min: 6,
    step: 1
  },
  randomizeColors: {
    type: "boolean",
    default: true
  },
  consistentSet: {
    type: "boolean",
    default: false,
    editable: inputs => inputs.randomizeColors === true
  },
  firstColor: {
    type: "text",
    default: "grey1",
    options: Object.keys(greys),
    editable: inputs => inputs.randomizeColors === false
  },
  secondColor: {
    type: "text",
    default: "grey2",
    options: Object.keys(greys),
    editable: inputs => inputs.randomizeColors === false
  },
  thirdColor: {
    type: "text",
    default: "grey3",
    options: Object.keys(greys),
    editable: inputs => inputs.randomizeColors === false
  },
  randomizeColorOrder: {
    type: "boolean",
    default: true
  },
  fontMode: {
    type: "text",
    options: {
      "F Grotesk Thin": "FGroteskThin-Regular.otf",
      "F Grotesk": "FGrotesk-Regular.otf"
    },
    default: "F Grotesk Thin"
  }
};

export const settings = {
  engine: require("@mechanic-design/engine-react")
};
