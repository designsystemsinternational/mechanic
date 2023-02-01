export const drawBlock = (context, blockConfig, customStroke) => {
  const { position, block, colors } = blockConfig;
  block.rows.forEach(row =>
    row.bricks.forEach(brick => {
      const { x: xOffset, y: yOffset } = position;
      const { x: brickX, w, char, charX: brickCharX } = brick;
      const { background, blackOrWhite } = colors[brick.color % colors.length];

      const x = xOffset + brickX;
      const charX = x + brickCharX;
      const y = yOffset + row.rowIndex * block.rowHeight;
      const charY = y + block.fontYOffset;
      const h = block.rowHeight;

      context.fillStyle = background;
      context.strokeStyle = background;
      context.fillRect(x, y, w, h);
      context.strokeRect(x, y, w, h);

      const path = brick.glyph.getPath(charX, charY, block.fontSize);
      path.fill = customStroke || blackOrWhite;
      path.draw(context);
    })
  );
};
