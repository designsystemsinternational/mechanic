import React from "react";

export const Column = ({ width, height, x, y, showGrid, children }) => {
  return (
    <>
      <foreignObject width={width} height={height} x={x} y={y}>
        <div className="column">{children}</div>
      </foreignObject>

      {showGrid && (
        <rect
          width={width}
          height={height}
          x={x}
          y={y}
          fill="none"
          stroke="white"
          strokeDasharray="10"
        />
      )}
    </>
  );
};
