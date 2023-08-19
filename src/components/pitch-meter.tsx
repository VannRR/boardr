/* eslint-disable react/react-in-jsx-scope */

import { useSignalEffect } from "@preact/signals";

import { PitchMeterProps, Canvas, Ctx, Coord, Diff } from "../types";

const width = 33 * 10;
const height = 1.8 * 10;

const markWidth = Math.floor(width * 0.01);
const markHeight = Math.floor(height * 0.33);

const needleWidth = Math.floor(width * 0.03);
const needleHeight = Math.floor(height * 0.5);
const middle = Math.round(width * 0.5);

let prevMarkX: Coord | null = null;

const drawMark = (ctx: Ctx, x: Coord) => {
  ctx.fillRect(Math.ceil(x - markWidth * 0.75), 0, markWidth, markHeight);
};

const drawNeedle = (ctx: Ctx, x: Coord, y: Coord, point: number) => {
  ctx.beginPath();
  ctx.moveTo(Math.floor(x - needleWidth * 0.5), y);
  ctx.lineTo(Math.floor(x + needleWidth * 0.5), y);
  ctx.lineTo(x, y + needleHeight * point);
  ctx.fill();
};

const drawBackground = (ctx: Ctx) => {
  ctx.clearRect(0, 0, width, height);

  const segment = width / 24;

  for (
    let left = middle, right = middle;
    left > 0;
    left -= segment, right += segment
  ) {
    drawMark(ctx, left);
    drawMark(ctx, right);
  }

  drawNeedle(ctx, middle, 0, 1);
};

const drawForeground = (ctx: Ctx, difference: Diff) => {
  if (prevMarkX !== null) {
    ctx.clearRect(
      Math.floor(prevMarkX - needleWidth * 0.5),
      needleHeight,
      needleWidth,
      needleHeight
    );
  }

  const x = Math.floor(middle * (difference + 1));
  drawNeedle(ctx, x, height, -1);

  prevMarkX = x;
};

export function PitchMeter(props: PitchMeterProps) {
  const layers: Canvas[] = [null, null];

  const getCanvas = (canvas: Canvas) => {
    if (!canvas) return null;
    return canvas;
  };

  useSignalEffect(() => {
    if (!layers[0]) return;
    const ctx = layers[0].getContext("2d") as Ctx;
    ctx.fillStyle = props.colors.value.foreground;
    ctx.strokeStyle = props.colors.value.foreground;
    drawBackground(ctx);
  });

  useSignalEffect(() => {
    if (!layers[1]) return;
    const ctx = layers[1].getContext("2d") as Ctx;
    ctx.fillStyle = props.colors.value.foreground;
    ctx.strokeStyle = props.colors.value.foreground;
    drawForeground(ctx, props.difference.value);
  });

  return (
    <>
      <div id="pitch-meter-wrapper">
        <label id="pitch-meter-label">Pitch Meter</label>
        {layers.map((_canvas, i) => {
          return (
            <canvas
              key={i}
              className="pitch-meter-canvas"
              ref={(r) => (layers[i] = getCanvas(r))}
              width={width}
              height={height}
              style={{
                zIndex: i,
              }}
            ></canvas>
          );
        })}
      </div>
    </>
  );
}
