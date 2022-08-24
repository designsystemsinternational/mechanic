import React, { useEffect } from "react";

import * as css from "./styles.module.css";

const showText = true;
const showBackground = true;
const showTrack = false;

const fontHeight = 40;

// Number of seconds it takes the text to move one cycle
const txtCycle = 8;

// Track
const trackWidth = 320;
const trackHeight = 50;
const trackRadius = trackHeight / 2;
const trackStraightLength = trackWidth - 2 * trackRadius;
const trackRoundLength = Math.PI * trackRadius;
const trackLength = 2 * trackStraightLength + 2 * trackRoundLength;

// Background
const backRadius = trackRadius + fontHeight;
const backWidth = trackWidth + 2 * fontHeight;
const backHeight = trackHeight + 2 * fontHeight;
const backStraightLength = trackWidth - 2 * trackRadius;
const backStraightDur = txtCycle * (trackStraightLength / trackLength);
const backRoundDur = txtCycle * (trackRoundLength / trackLength);

const leftCx = backRadius + 0.5;
const rightCx = backRadius + backStraightLength - 0.5;

export const handler = ({ inputs, mechanic }) => {
  const { width } = inputs;

  useEffect(() => {
    mechanic.done();
  }, []);

  return (
    <svg
      className={css.root}
      viewBox={`0 0 ${backWidth} ${backHeight}`}
      width={width}
    >
      {showBackground && (
        <g>
          <ellipse
            cx={leftCx}
            cy={backRadius}
            rx={backRadius / 2}
            ry={backRadius / 2}
            strokeWidth={backRadius}
            stroke="var(--red)"
            fill="none"
          />
          <ellipse
            cx={rightCx}
            cy={backRadius}
            rx={backRadius / 2}
            ry={backRadius / 2}
            strokeWidth={backRadius}
            stroke="var(--red)"
            fill="none"
          />
          <ellipse
            cx={rightCx}
            cy={backRadius}
            rx={backRadius / 2}
            ry={backRadius / 2}
            strokeWidth={backRadius}
            stroke="var(--blue)"
            fill="none"
            strokeDasharray={Math.PI * (backRadius / 2)}
            strokeDashoffset={Math.PI * (backRadius * 0.75)}
          >
            <animate
              id="right1"
              attributeName="stroke-dashoffset"
              from={Math.PI * (backRadius * 0.75)}
              to={Math.PI * (backRadius * 0.25)}
              begin="top1.end"
              dur={`${backRoundDur}s`}
              fill="freeze"
            />
            <animate
              id="right2"
              attributeName="stroke-dashoffset"
              from={Math.PI * (backRadius * 1.25)}
              to={Math.PI * (backRadius * 0.75)}
              begin="top3.end"
              dur={`${backRoundDur}s`}
              fill="freeze"
            />
          </ellipse>
          <ellipse
            cx={leftCx}
            cy={backRadius}
            rx={backRadius / 2}
            ry={backRadius / 2}
            strokeWidth={backRadius}
            stroke="var(--blue)"
            fill="none"
            strokeDasharray={Math.PI * (backRadius / 2)}
            strokeDashoffset={Math.PI * (backRadius * 1.25)}
          >
            <animate
              id="left1"
              attributeName="stroke-dashoffset"
              from={Math.PI * (backRadius * 1.25)}
              to={Math.PI * (backRadius * 0.75)}
              begin="bot1.end"
              dur={`${backRoundDur}s`}
              fill="freeze"
            />
            <animate
              id="left2"
              attributeName="stroke-dashoffset"
              from={Math.PI * (backRadius * 0.75)}
              to={Math.PI * (backRadius * 0.25)}
              begin="bot3.end"
              dur={`${backRoundDur}s`}
              fill="freeze"
            />
          </ellipse>
          {/* This is a fake element for the start of the SVG animation */}
          <ellipse
            cx={leftCx}
            cy={backRadius}
            rx={backRadius / 2}
            ry={backRadius / 2}
            strokeWidth={backRadius}
            stroke="var(--blue)"
            fill="none"
            strokeDasharray={Math.PI * (backRadius / 2)}
            strokeDashoffset={Math.PI * (backRadius * 0.75)}
          >
            <animate
              attributeName="stroke-dashoffset"
              from={Math.PI * (backRadius * 0.75)}
              to={Math.PI * (backRadius * 0.25)}
              begin="fakeBot.end"
              dur={`${backRoundDur}s`}
              fill="freeze"
            />
          </ellipse>
          <rect
            x={backRadius}
            y={0}
            width={backStraightLength}
            height={backRadius * 2}
            stroke="none"
            fill="var(--red)"
          />
          <rect
            x={backRadius}
            y="0"
            width={0}
            height={backRadius}
            fill="var(--blue)"
          >
            <animate
              id="top1"
              attributeName="width"
              from={0}
              to={backStraightLength}
              begin="0.1s;left1.end"
              dur={`${backStraightDur}s`}
              fill="freeze"
            />
            <animate
              id="top2"
              attributeName="x"
              from={backRadius}
              to={trackWidth + fontHeight / 2}
              begin={`${txtCycle / 2 + 0.15}s;left2.end`}
              dur={`${backStraightDur}s`}
            />
            )
            <animate
              id="top3"
              attributeName="width"
              from={backStraightLength}
              to={0}
              begin="top2.begin"
              dur={`${backStraightDur}s`}
              fill="freeze"
            />
          </rect>
          <rect
            x={backRadius}
            y={backRadius}
            width={0}
            height={backRadius}
            fill="var(--blue)"
          >
            <animate
              id="bot1"
              attributeName="x"
              from={backRadius + backStraightLength}
              to={backRadius}
              begin={`right1.end`}
              dur={`${backStraightDur}s`}
            />
            <animate
              id="bot2"
              attributeName="width"
              from={0}
              to={backStraightLength}
              begin={`right1.end`}
              dur={`${backStraightDur}s`}
              fill="freeze"
            />
            <animate
              id="bot3"
              attributeName="width"
              from={backStraightLength}
              to={0}
              begin="right2.end"
              dur={`${backStraightDur}s`}
              fill="freeze"
            />
          </rect>
          {/* This is a fake element for the start of the SVG animation */}
          <rect
            x={backRadius}
            y={backRadius}
            width={backStraightLength}
            height={backRadius}
            fill="var(--blue)"
          >
            <animate
              id="fakeBot"
              attributeName="width"
              from={backStraightLength}
              to={0}
              begin="0.1s"
              dur={`${backStraightDur}s`}
              fill="freeze"
            />
          </rect>
        </g>
      )}
      <g>
        <path
          id="track1"
          fill="none"
          stroke={showTrack ? "black" : "none"}
          transform={`translate(${fontHeight},${fontHeight})`}
          d={`M ${trackRadius},0 h ${
            trackWidth - 2 * trackRadius
          } a ${trackRadius} ${trackRadius} 0 0 1 0 ${
            2 * trackRadius
          } H ${trackRadius} a ${trackRadius} ${trackRadius} 0 0 1 0 -${
            2 * trackRadius
          }`}
        />
        <path
          id="track2"
          fill="none"
          stroke={showTrack ? "black" : "none"}
          transform={`translate(${fontHeight},${fontHeight})`}
          d={`M ${trackWidth - trackRadius},${
            trackRadius * 2
          } H ${trackRadius} a ${trackRadius} ${trackRadius} 0 0 1 0 -${
            2 * trackRadius
          } h ${
            trackWidth - 2 * trackRadius
          } a ${trackRadius} ${trackRadius} 0 0 1 0 ${2 * trackRadius}`}
        />
      </g>
      {showText && (
        <g>
          <text fill="white">
            <textPath href="#track1">
              MECHANIC
              <animate
                id="txt1"
                attributeName="startOffset"
                from={0}
                to={trackLength}
                begin="0s"
                dur={`${txtCycle}s`}
                repeatCount="indefinite"
              />
            </textPath>
            <textPath href="#track2">
              MECHANIC
              <animate
                attributeName="startOffset"
                from={-trackLength / 2}
                to={trackLength / 2}
                begin="txt1.begin"
                dur={`${txtCycle}s`}
                repeatCount="indefinite"
              />
            </textPath>
            <textPath href="#track2">
              MECHANIC
              <animate
                attributeName="startOffset"
                from={0}
                to={trackLength}
                begin="txt1.begin"
                dur={`${txtCycle}s`}
                repeatCount="indefinite"
              />
            </textPath>
            <textPath href="#track1">
              MECHANIC
              <animate
                attributeName="startOffset"
                from={-trackLength / 2}
                to={trackLength / 2}
                begin="txt1.begin"
                dur={`${txtCycle}s`}
                repeatCount="indefinite"
              />
            </textPath>
          </text>
        </g>
      )}
    </svg>
  );
};

export const inputs = {
  width: {
    type: "number",
    default: 850,
  },
  step: {
    type: "number",
    default: 0,
    min: 0,
    step: 0.05,
    max: 1,
    slider: true,
  },
};

export const settings = {
  engine: require("@mechanic-design/engine-react"),
};
