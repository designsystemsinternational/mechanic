import React from "react";

export const Image = ({
  href,
  x,
  width,
  height,
  gutterRatio,
  filterOpacity,
  gridColor
}) => {
  return (
    <>
      <defs>
        {/* mask to crop the image into rectangle */}
        <mask id="image-mask">
          <rect fill="#fff" width={width} height={height} x={x} />
        </mask>
      </defs>

      {/* the image that will be cropped */}
      <image
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        mask="url(#image-mask)"
        href={href}
      />

      {/* filter applied over image */}
      <rect
        fill="#000"
        width={width}
        height={height}
        x={x}
        style={{ mixBlendMode: "multiply" }}
        opacity={filterOpacity / 100}
      />

      {/* lines surrounding image */}

      <line
        strokeWidth="2"
        opacity="0.7"
        stroke={gridColor}
        x1={x - gutterRatio / 2}
        x2={x - gutterRatio / 2}
        y1={0}
        y2={height}
      />

      <line
        strokeWidth="2"
        opacity="0.7"
        stroke={gridColor}
        x1={x + width + gutterRatio / 2}
        x2={x + width + gutterRatio / 2}
        y1={0}
        y2={height}
      />
    </>
  );
};
