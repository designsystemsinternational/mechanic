// import "./assets/PPObjectSans-Regular.otf";
// import "./assets/PPObjectSans-Heavy.otf";

import {
  getPossibleStartPositions,
  removeRowsUsedByElement,
  getSections,
  getIntersectionOffset,
  getRowsFromElements,
  getRandomSubsetSections,
  choice,
  flipCoin,
  randInt,
} from "./utils.js";

export const handler = (sketch, params, mechanic) => {
  const { width, height, date, dayAndTime, artist, description, image, color } =
    params;
  const artistText = artist.toUpperCase();
  const descriptionText = description.toUpperCase();
  const dateText = date.toUpperCase();
  const dayAndTimeText = dayAndTime.toUpperCase();

  let artistElement;
  let dateElement;
  let descriptionElement;

  const rows = 32;
  const separation = height / rows;
  const availableRows = Array.from({ length: rows }, (_, k) => k);

  let img;
  let imgGraphic;
  // let objectSansRegular;
  // let objectSansHeavy;

  const loadImageAndAddFilter = () => {
    imgGraphic = sketch.createGraphics(img.width, img.height);
    imgGraphic.image(img, 0, 0);
    imgGraphic.filter(imgGraphic.GRAY);
    imgGraphic.blendMode(imgGraphic.MULTIPLY);
    imgGraphic.noStroke();
    imgGraphic.fill(color);
    imgGraphic.rect(0, 0, img.width, img.height);
    imgGraphic.blendMode(imgGraphic.BLEND);
  };

  const drawGrid = () => {
    for (let i = 0; i <= 32; i++) {
      sketch.line(0, separation * i, width, separation * i);
    }
  };

  const setStylingBase = () => {
    sketch.background("white");
    sketch.stroke(color);
    sketch.fill(color);
    sketch.textFont("PP Object Sans");
  };

  const drawArtistElement = () => {
    const element = {};
    element.baseRowSize = randInt(2, 6);
    element.baseSize = element.baseRowSize * separation;

    const words = artistText.split(" ");
    sketch.textSize(element.baseSize);
    sketch.textStyle(sketch.BOLDITALIC);
    const lengths = words.map((t) => sketch.textWidth(t));
    element.length = Math.max(width / 3, ...lengths) + width / 20;

    element.startRow = choice(
      getPossibleStartPositions(
        availableRows,
        element.baseRowSize * words.length
      )
    );
    element.endRow = element.startRow + words.length * element.baseRowSize - 1;
    element.y = element.startRow * separation;
    element.x1 = 0;
    element.x2 = element.length + element.x1;

    sketch.textAlign(sketch.LEFT, sketch.TOP);
    let x = element.x1;
    while (x < width) {
      for (let i = 0; i < words.length; i++) {
        sketch.text(
          words[i],
          x,
          element.y + i * element.baseSize,
          element.length
        );
      }
      x += element.length;
    }

    return element;
  };

  const drawDescriptionElement = () => {
    const element = {};
    element.baseRowSize = 2;
    element.baseSize = element.baseRowSize * separation;

    sketch.textSize(element.baseSize);
    sketch.textStyle(sketch.NORMAL);
    element.length = sketch.textWidth(descriptionText) + width / 20;

    element.startRow = choice(
      getPossibleStartPositions(availableRows, element.baseRowSize)
    );
    element.endRow = element.startRow + element.baseRowSize - 1;
    element.y = element.startRow * separation;
    element.x1 = 0;
    element.x2 = element.x1 + element.length;

    sketch.text(descriptionText, 0, element.y);

    return element;
  };

  const drawDateElement = () => {
    const element = {};
    element.isSingleRow = flipCoin();
    element.baseRowSize = 1;
    element.baseSize = element.baseRowSize * separation;

    element.startRow = choice(
      getPossibleStartPositions(
        availableRows,
        (element.isSingleRow ? 1 : 2) * element.baseRowSize
      )
    );
    element.endRow =
      element.startRow +
      (element.isSingleRow ? 1 : 2) * element.baseRowSize -
      1;
    element.y = element.startRow * separation;
    const offset = getIntersectionOffset(element, [descriptionElement]);
    const leftWidth = width - offset;
    element.midDistance = randInt(
      Math.floor(leftWidth / 20),
      Math.floor(leftWidth / 4)
    );
    sketch.textSize(element.baseSize);
    sketch.textStyle(sketch.BOLD);
    element.length =
      (element.isSingleRow
        ? Math.max(
            leftWidth / 2,
            sketch.textWidth(dateText) +
              element.midDistance +
              sketch.textWidth(dayAndTimeText)
          )
        : Math.max(
            leftWidth / 4,
            Math.max(
              sketch.textWidth(dateText),
              sketch.textWidth(dayAndTimeText)
            )
          )) +
      leftWidth / 20;
    element.x1 =
      offset +
      (flipCoin() ? 0 : randInt(0, Math.floor(leftWidth - element.length)));
    element.x2 = element.x1 + element.length;

    const [first, second] = flipCoin()
      ? [dateText, dayAndTimeText]
      : [dayAndTimeText, dateText];

    if (element.isSingleRow) {
      sketch.text(first, element.x1, element.y);
      sketch.text(
        second,
        element.x1 + sketch.textWidth(first) + element.midDistance,
        element.y
      );
    } else {
      const alignDateRight = flipCoin();
      if (alignDateRight) {
        sketch.textAlign(sketch.RIGHT, sketch.TOP);
      }
      sketch.text(
        first,
        alignDateRight ? element.x2 - leftWidth / 20 : element.x1,
        element.y
      );
      sketch.text(
        second,
        alignDateRight ? element.x2 - leftWidth / 20 : element.x1,
        element.y + element.baseSize
      );
    }
    sketch.textAlign(sketch.LEFT, sketch.TOP);

    return element;
  };

  const drawRectangle = ({ rectX, rectY, rectWidth, rectHeight }) => {
    if (img) {
      let sx, sy, sw, sh;
      const rectRatio = rectWidth / rectHeight;
      const imageRatio = imgGraphic.width / imgGraphic.height;
      sw =
        rectRatio > imageRatio
          ? imgGraphic.width
          : imgGraphic.height * rectRatio;
      sh =
        rectRatio > imageRatio
          ? imgGraphic.width / rectRatio
          : imgGraphic.height;
      sx = (imgGraphic.width - sw) / 2;
      sy = (imgGraphic.height - sh) / 2;
      sketch.image(
        imgGraphic,
        rectX,
        rectY,
        rectWidth,
        rectHeight,
        sx,
        sy,
        sw,
        sh
      );
    } else {
      sketch.rect(rectX, rectY, rectWidth, rectHeight);
    }
  };

  const drawRectangles = () => {
    const maxUsedSpace = Math.max(
      artistElement.x2,
      descriptionElement.x2,
      dateElement.x2
    );
    const canThereBeTwoColumns = width - maxUsedSpace > width / 4 + width / 20;
    const columnLength = width / 4;
    let bigColumnDrawn = false;
    if (canThereBeTwoColumns && flipCoin()) {
      bigColumnDrawn = true;
    }

    const elementRows = getRowsFromElements([descriptionElement, dateElement]);
    const usedSections = getSections(elementRows, 2);
    const freeSections = getSections(availableRows, 2);
    const sections = [
      ...getRandomSubsetSections(
        freeSections,
        freeSections.length > 2
          ? randInt(freeSections.length - 2, freeSections.length)
          : freeSections.length
      ),
      ...getRandomSubsetSections(usedSections, randInt(0, usedSections.length)),
    ];

    for (const section of sections) {
      const [row, rowLength] = section;
      const rectRowHeight = rowLength;
      const separateInColumns = bigColumnDrawn || flipCoin();
      const offset = getIntersectionOffset(
        {
          startRow: row,
          endRow: row + rowLength - 1,
        },
        [descriptionElement, dateElement]
      );
      const leftWidth = width - offset;
      const rectY = row * separation;
      const rectHeight = rectRowHeight * separation;
      if (separateInColumns) {
        drawRectangle({
          rectX: offset,
          rectY,
          rectHeight,
          rectWidth: leftWidth - (columnLength + width / 20),
        });
        drawRectangle({
          rectX: width - columnLength,
          rectY,
          rectHeight,
          rectWidth: columnLength,
        });
      } else {
        drawRectangle({
          rectX: offset,
          rectY,
          rectHeight,
          rectWidth: leftWidth,
        });
      }
    }

    if (bigColumnDrawn) {
      drawRectangle({
        rectX: width - columnLength,
        rectY: 0,
        rectHeight: height,
        rectWidth: width - columnLength,
      });
    }
  };

  sketch.preload = () => {
    if (image) {
      img = sketch.loadImage(URL.createObjectURL(image));
    }
    //   objectSansRegular = sketch.loadFont(
    //     "./functions/p5/assets/PPObjectSans-Regular.otf"
    //   );
    //   objectSansHeavy = sketch.loadFont(
    //     "./functions/p5/assets/PPObjectSans-Heavy.otf"
    //   );
  };

  sketch.setup = () => {
    sketch.createCanvas(width, height);
    if (img) {
      loadImageAndAddFilter();
    }
  };

  sketch.draw = () => {
    setStylingBase();

    drawGrid();

    artistElement = drawArtistElement();

    removeRowsUsedByElement(availableRows, artistElement);

    descriptionElement = drawDescriptionElement();

    dateElement = drawDateElement();

    removeRowsUsedByElement(availableRows, descriptionElement);
    removeRowsUsedByElement(availableRows, dateElement);

    drawRectangles();

    mechanic.done();
  };
};

export const params = {
  date: {
    type: "text",
    default: "12.9.2021",
  },
  dayAndTime: {
    type: "text",
    default: "Thursday, 8PM",
  },
  artist: {
    type: "text",
    default: "Oliver Taro",
  },
  description: {
    type: "text",
    default: "Live",
  },
  image: {
    type: "image",
  },
  color: {
    type: "color",
    default: "#E94225",
    model: "hex",
  },
  width: {
    type: "number",
    default: 500,
    editable: false,
  },
  height: {
    type: "number",
    default: 600,
    editable: false,
  },
};

export const presets = {
  x2: {
    width: 1000,
    height: 1200,
  },
  x4: {
    width: 1500,
    height: 1800,
  },
};

export const settings = {
  engine: require("@designsystemsinternational/mechanic-engine-p5"),
  usesRandom: true,
};
