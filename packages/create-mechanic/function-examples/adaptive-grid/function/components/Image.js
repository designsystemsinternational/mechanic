import React from "react";

const defaultUrl =
  "https://images.unsplash.com/photo-1568214697537-ace27ffd6cf3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1888&q=80";

export const Image = ({
  image,
  href,
  x,
  width,
  height,
  gutterRatio,
  filterOpacity,
  gridColor,
}) => {
  const imageHref = image ? (href ? href : "") : defaultUrl;

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
        href={imageHref}
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
