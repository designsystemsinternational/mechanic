export const canvasDraw = (context, block) => {
  block.rows.forEach(row =>
    row.bricks.forEach(brick => {
      const { background, blackOrWhite } = brick.color;
      const { x: brickX, w, char, charX: brickCharX } = brick;

      const x = block.xOffset + brickX;
      const charX = x + brickCharX;
      const y = block.yOffset + row.rowIndex * block.rowHeight;
      const charY = y + block.fontYOffset;
      const h = block.rowHeight;

      context.fillStyle = background;
      context.strokeStyle = background;
      context.fillRect(x, y, w, h);
      context.strokeRect(x, y, w, h);
      context.fillStyle = blackOrWhite;
      context.font = `${block.fontSize}px F, Helvetica, Sans-Serif`;
      context.fillText(char, charX, charY);
    })
  );
};
