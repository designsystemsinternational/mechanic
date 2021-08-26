export const getSections = (availableRows, filter = 0) => {
  const sections = [];
  let counter;
  let lastRow;
  for (const row of availableRows) {
    if (lastRow !== undefined) {
      if (lastRow + 1 !== row) {
        sections.push([lastRow - (counter - 1), counter]);
        counter = 1;
      } else {
        counter += 1;
      }
    } else {
      counter = 1;
    }
    lastRow = row;
  }
  sections.push([lastRow - (counter - 1), counter]);
  return filter > 0 ? sections.filter((s) => s[1] > filter) : sections;
};

export const choice = (values) => {
  const index = Math.floor(Math.random() * values.length);
  return values[index];
};

export const flipCoin = () => Math.random() < 0.5;

export const randInt = (a = 0, b = 1) =>
  a + Math.floor(Math.random() * (b - a));

export const getPossibleStartPositions = (availableRows, length) => {
  const possibilities = [];
  let counter = 0;
  let lastRow;
  for (const row of availableRows) {
    if (lastRow !== undefined) {
      if (lastRow + 1 === row) {
        counter += 1;
      } else {
        counter = 1;
      }
    } else {
      counter = 1;
    }
    if (counter >= length) {
      possibilities.push(row - (length - 1));
    }
    lastRow = row;
  }
  return possibilities;
};

export const removeRowsUsedByElement = (availableRows, element) => {
  for (let row = element.startRow; row <= element.endRow; row++) {
    const index = availableRows.indexOf(row);
    if (index > -1) {
      availableRows.splice(availableRows.indexOf(row), 1);
    }
  }
};

export const getRowsFromElements = (elements) => {
  const rows = new Set();
  for (const element of elements) {
    for (let row = element.startRow; row <= element.endRow; row++) {
      rows.add(row);
    }
  }
  const array = [...rows];
  array.sort();
  return array;
};

export const getIntersectionOffset = (element, otherElements) => {
  let maxOffset = 0;
  for (const otherElement of otherElements) {
    const intersects =
      (element.startRow >= otherElement.startRow &&
        element.startRow <= otherElement.endRow) ||
      (otherElement.startRow >= element.startRow &&
        otherElement.startRow <= element.endRow);
    const offset = intersects ? otherElement.x2 : 0;
    maxOffset = offset > maxOffset ? offset : maxOffset;
  }
  return maxOffset;
};

export const getRandomSubsetSections = (sections, number) => {
  const selected = [];
  for (let index = 0; index < number; index++) {
    const [row, rowLength] = choice(sections);
    selected.push([row, rowLength]);
    let sectionIndex;
    for (let index = 0; index < sections.length; index++) {
      if (sections[index][0] === row && sections[index][1] === rowLength) {
        sectionIndex = index;
        break;
      }
    }
    sections.splice(sectionIndex, 1);
  }
  return selected;
};
