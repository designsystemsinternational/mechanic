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

const interpolate = (from, to, progress, fromProgress = 0, toProgress = 1) =>
  from +
  ((to - from) *
    (Math.min(Math.max(progress, fromProgress), toProgress) - fromProgress)) /
    (toProgress - fromProgress);

const startOff1 = 0.1 / txtCycle;
const startOff2 = startOff1 + backStraightDur / txtCycle;
const startOff3 = startOff2 + backRoundDur / txtCycle;
const startOff4 = startOff3 + backStraightDur / txtCycle;
const startOff5 = startOff4 + backRoundDur / txtCycle;

const middleOff1 = (txtCycle / 2 + 0.15) / txtCycle;
const middleOff2 = middleOff1 + backStraightDur / txtCycle;
const middleOff3 = middleOff2 + backRoundDur / txtCycle;
const middleOff4 = middleOff3 + backStraightDur / txtCycle;
const middleOff5 = middleOff4 + backRoundDur / txtCycle;

export const handler = ({ inputs, mechanic }) => {
  const { width, progress } = inputs;

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
            strokeDashoffset={
              progress < startOff3
                ? interpolate(
                    Math.PI * (backRadius * 0.75),
                    Math.PI * (backRadius * 0.25),
                    progress,
                    startOff2,
                    startOff3
                  )
                : interpolate(
                    Math.PI * (backRadius * 1.25),
                    Math.PI * (backRadius * 0.75),
                    progress,
                    middleOff2,
                    middleOff3
                  )
            }
          >
            {/* <animate
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
            /> */}
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
            strokeDashoffset={
              progress < middleOff4
                ? interpolate(
                    Math.PI * (backRadius * 1.25),
                    Math.PI * (backRadius * 0.75),
                    progress,
                    startOff4,
                    startOff5
                  )
                : interpolate(
                    Math.PI * (backRadius * 0.75),
                    Math.PI * (backRadius * 0.25),
                    progress,
                    middleOff4,
                    middleOff5
                  )
            }
          >
            {/* <animate
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
            /> */}
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
            strokeDashoffset={interpolate(
              Math.PI * (backRadius * 0.75),
              Math.PI * (backRadius * 0.25),
              progress,
              startOff2,
              startOff3
            )}
          >
            {/* <animate
              attributeName="stroke-dashoffset"
              from={Math.PI * (backRadius * 0.75)}
              to={Math.PI * (backRadius * 0.25)}
              begin="fakeBot.end"
              dur={`${backRoundDur}s`}
              fill="freeze"
            /> */}
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
            y="0"
            width={
              progress <= middleOff1
                ? interpolate(
                    0,
                    backStraightLength,
                    progress,
                    startOff1,
                    startOff2
                  )
                : interpolate(
                    backStraightLength,
                    0,
                    progress,
                    middleOff1,
                    middleOff2
                  )
            }
            height={backRadius}
            fill="var(--blue)"
            x={interpolate(
              backRadius,
              trackWidth + fontHeight / 2,
              progress,
              middleOff1,
              middleOff2
            )}
          >
            {/* <animate
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
            /> */}
          </rect>
          <rect
            y={backRadius}
            height={backRadius}
            fill="var(--blue)"
            x={interpolate(
              backRadius + backStraightLength,
              backRadius,
              progress,
              startOff3,
              startOff4
            )}
            width={
              progress < middleOff3
                ? interpolate(
                    0,
                    backStraightLength,
                    progress,
                    startOff3,
                    startOff4
                  )
                : interpolate(
                    backStraightLength,
                    0,
                    progress,
                    middleOff3,
                    middleOff4
                  )
            }
          >
            {/* <animate
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
            /> */}
          </rect>
          {/* This is a fake element for the start of the SVG animation */}
          <rect
            x={backRadius}
            y={backRadius}
            width={interpolate(
              backStraightLength,
              0,
              progress,
              startOff1,
              startOff2
            )}
            height={backRadius}
            fill="var(--blue)"
          >
            {/* <animate
              id="fakeBot"
              attributeName="width"
              from={backStraightLength}
              to={0}
              begin="0.1s"
              dur={`${backStraightDur}s`}
              fill="freeze"
            /> */}
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
            <textPath
              href="#track1"
              startOffset={interpolate(0, trackLength, progress)}
              className={css.textPath}
            >
              MECHANIC
            </textPath>
            <textPath
              href="#track2"
              startOffset={interpolate(
                -trackLength / 2,
                trackLength / 2,
                progress
              )}
              className={css.textPath}
            >
              MECHANIC
            </textPath>
            <textPath
              href="#track2"
              startOffset={interpolate(0, trackLength, progress)}
              className={css.textPath}
            >
              MECHANIC
            </textPath>
            <textPath
              href="#track1"
              startOffset={interpolate(
                -trackLength / 2,
                trackLength / 2,
                progress
              )}
              className={css.textPath}
            >
              MECHANIC
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
  progress: {
    type: "number",
    default: 0,
    min: 0,
    step: 0.01,
    max: 1,
    slider: true,
  },
};

export const settings = {
  engine: require("@mechanic-design/engine-react"),
};
