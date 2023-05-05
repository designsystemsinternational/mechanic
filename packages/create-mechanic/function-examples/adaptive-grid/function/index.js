import React, { useEffect } from "react";

import { Image } from "./components/Image";
import { Column } from "./components/Column";
import { useImageHref, usePotentialRandomValue } from "./hooks";
import {
  getRandomInt,
  getRandomSign,
  getRandomColor,
  brightnessByColor,
} from "./utils";

import "./styles.css";

export const handler = ({ inputs, mechanic }) => {
  const {
    width,
    height,
    randomRatio,
    grid,
    textSize,
    randomColor,
    textOne,
    textTwo,
    textThree,
    textFour,
    title,
    image,
    filterOpacity,
    titleSizeAdjust,
  } = inputs;

  const canvasRatio = width / height;
  const columnOptions = canvasRatio >= 0.5 ? (canvasRatio >= 0.75 ? 3 : 2) : 1;

  // Colors
  const textColor = usePotentialRandomValue(
    getRandomColor,
    randomColor.textColor,
    randomColor.show
  );
  const titleColor = usePotentialRandomValue(
    getRandomColor,
    randomColor.titleColor,
    randomColor.show
  );
  const backgroundColor = usePotentialRandomValue(
    getRandomColor,
    randomColor.backgroundColor,
    randomColor.show
  );

  // Column ratios
  const columnOneRatio = usePotentialRandomValue(
    () => getRandomInt(2, 10),
    randomRatio.columnOneRatio,
    randomRatio.show
  );
  const columnTwoRatio = usePotentialRandomValue(
    () => getRandomInt(2, 10),
    canvasRatio >= 0.5 ? randomRatio.columnTwoRatio : 0,
    canvasRatio >= 0.5 && randomRatio.show
  );
  const columnThreeRatio = usePotentialRandomValue(
    () => getRandomInt(2, 10),
    canvasRatio >= 0.75 ? randomRatio.columnThreeRatio : 0,
    canvasRatio >= 0.75 && randomRatio.show
  );
  const imageColumn = usePotentialRandomValue(
    () => getRandomInt(1, columnOptions + 1),
    randomRatio.imageColumn,
    randomRatio.show
  );

  // Other spacing
  const border = usePotentialRandomValue(
    () => getRandomInt(15, 65),
    randomRatio.border,
    randomRatio.show
  );
  const gutter = usePotentialRandomValue(
    () => getRandomInt(15, 45),
    randomRatio.gutter,
    randomRatio.show
  );

  // Horizontal space
  const borderRatio = (border * width) / 1080;
  const gutterRatio = (gutter * width) / 1080;
  const ratioSum =
    (width - borderRatio * 2 - gutterRatio * (columnOptions - 1)) /
    (columnOneRatio + columnTwoRatio + columnThreeRatio);
  const oneWidth = ratioSum * columnOneRatio;
  const twoWidth = ratioSum * columnTwoRatio;
  const threeWidth = ratioSum * columnThreeRatio;

  const chooseW = [
    canvasRatio >= 0.5
      ? oneWidth + borderRatio + gutterRatio * 0.5
      : oneWidth + borderRatio * 2,
    canvasRatio >= 0.75
      ? twoWidth + gutterRatio
      : twoWidth + gutterRatio * 0.5 + borderRatio,
    threeWidth + borderRatio + borderRatio * 0.5,
  ];
  const chooseX = [
    0,
    borderRatio + gutterRatio * 0.5 + oneWidth,
    borderRatio + gutterRatio * 1.5 + oneWidth + twoWidth,
  ];
  const cropWidth = chooseW[imageColumn - 1];
  const cropX = chooseX[imageColumn - 1];

  const fullHeight = height - borderRatio * 2;
  const textSizeRatio =
    ((textSize - (canvasRatio - 0.5) * 2) * width) /
    1080 /
    Math.min(canvasRatio, 1);
  const titleSize =
    ((textSize - title.length * 0.8 + titleSizeAdjust) * 10 * width) /
    1080 /
    Math.min(canvasRatio, 1);
  const titleAngle = usePotentialRandomValue(
    () => getRandomSign() * Math.random() * (60 / canvasRatio),
    null,
    true
  );

  const gridColor = brightnessByColor(backgroundColor) > 127 ? "#000" : "#fff";

  const bigTextStyle = {
    color: titleColor,
    fontSize: textSizeRatio * 1.5,
    fontFamily: "Object Sans",
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
    hyphens: "auto",
  };

  const textStyle = {
    color: textColor,
    fontSize: textSizeRatio,
    fontFamily: "Object Sans",
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
    hyphens: "auto",
  };

  const href = useImageHref(image);

  useEffect(() => {
    if (!image || href !== "") {
      mechanic.done();
    }
  }, [image, href]);

  return (
    <svg width={width} height={height}>
      <rect fill={backgroundColor} width={width} height={height} />

      <Image
        image={image}
        href={href}
        width={cropWidth}
        height={height}
        x={cropX}
        gutterRatio={gutterRatio}
        filterOpacity={filterOpacity}
        gridColor={gridColor}
      />

      <Column
        width={oneWidth}
        height={fullHeight}
        x={borderRatio}
        y={borderRatio}
        showGrid={grid}
      >
        <div className="top" style={bigTextStyle}>
          <p>{textOne}</p>
          {canvasRatio < 0.5 && (
            <>
              <br />
              <p>{textFour}</p>
            </>
          )}
        </div>

        <div className="bottom" style={textStyle}>
          <p>{textTwo}</p>
          {canvasRatio < 0.5 && (
            <>
              <br />
              <p>{textThree}</p>
            </>
          )}
        </div>
      </Column>

      <Column
        width={twoWidth}
        height={fullHeight}
        x={chooseX[1] + gutterRatio * 0.5}
        y={borderRatio}
        showGrid={grid}
      >
        {canvasRatio < 0.75 && (
          <div className="top" style={bigTextStyle}>
            <p>{textFour}</p>
          </div>
        )}

        <div className="bottom" style={textStyle}>
          <p>{textThree}</p>
        </div>
      </Column>

      <Column
        width={threeWidth}
        height={fullHeight}
        x={chooseX[2] + borderRatio * 0.5}
        y={borderRatio}
        showGrid={grid}
      >
        <div className="top" style={bigTextStyle}>
          <p>{textFour}</p>
        </div>
      </Column>

      {/* title */}
      <text
        x={width / 2}
        y={height / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill={titleColor}
        fontWeight="regular"
        fontFamily="Object Sans Slanted"
        transform={`rotate(${titleAngle}, ${width / 2}, ${height / 2})`}
        fontSize={titleSize}
        letterSpacing={-titleSize / 20}
      >
        {title.toUpperCase()}
      </text>
    </svg>
  );
};

export const inputs = {
  width: {
    type: "number",
    default: 1000,
  },
  height: {
    type: "number",
    default: 1000,
  },
  randomRatio: {
    type: "groupToggle",
    default: true,
    label: "Random Ratio",
    inputs: {
      columnOneRatio: {
        type: "number",
        slider: true,
        default: 2,
        min: 1,
        max: 10,
        step: 1,
      },
      columnTwoRatio: {
        type: "number",
        slider: true,
        default: 2,
        min: 1,
        max: 10,
        step: 1,
      },
      columnThreeRatio: {
        type: "number",
        slider: true,
        default: 1,
        min: 1,
        max: 10,
        step: 1,
      },
      border: {
        type: "number",
        slider: true,
        default: 15,
        min: 1,
        max: 100,
        step: 1,
      },
      gutter: {
        type: "number",
        slider: true,
        default: 15,
        min: 1,
        max: 100,
        step: 1,
      },
      imageColumn: {
        type: "number",
        slider: true,
        default: 1,
        min: 1,
        max: 3,
        step: 1,
      },
    },
  },
  randomColor: {
    type: "groupToggle",
    default: false,
    label: "Random Color",
    inputs: {
      backgroundColor: {
        type: "color",
        model: "hex",
        default: "#000000",
      },
      textColor: {
        type: "color",
        model: "hex",
        default: "#ffffff",
      },
      titleColor: {
        type: "color",
        model: "hex",
        default: "#E94825",
      },
    },
  },
  image: {
    type: "image",
    multiple: false,
  },
  filterOpacity: {
    type: "number",
    default: 20,
    min: 0,
    max: 100,
    step: 1,
    slider: true,
  },
  textSize: {
    type: "number",
    default: 20,
  },
  titleSizeAdjust: {
    type: "number",
    slider: true,
    default: 0,
    min: -5,
    max: 15,
    step: 1,
  },
  title: {
    type: "text",
    default: "Mechanic",
  },
  textOne: {
    type: "text",
    default: "MUNUS SHIH",
  },
  textTwo: {
    type: "text",
    default: "MECHANIC.DESIGN INFO@MECHANIC.DESIGN",
  },
  textThree: {
    type: "text",
    default: "@MECHANIC 781 12TH ST, 8A, NEW YORK, NY 10003",
  },
  textFour: {
    type: "text",
    default: "MUNUS@MECHANIC.DESIGN",
  },
  grid: {
    type: "boolean",
    default: false,
  },
};

export const presets = {
  "Instagram Story": {
    width: 1080,
    height: 1920,
  },
  "Instagram Post": {
    width: 1080,
    height: 1080,
  },
  Poster: {
    width: 812,
    height: 1148,
  },
  Banner: {
    width: 1640,
    height: 624,
  },
  Ticket: {
    width: 394,
    height: 1126,
  },
};

export const settings = {
  engine: require("@mechanic-design/engine-react"),
  showMultipleExports: true,
};
