/* eslint-disable react/react-in-jsx-scope */
import { useComputed, useSignalEffect } from "@preact/signals";

import { getGuitarStringLabel } from "../modules/helpers";

import gClefPath from "../assets/g-clef.svg";
import cClefPath from "../assets/c-clef.svg";
import fClefPath from "../assets/f-clef.svg";
import sharpPath from "../assets/sharp.svg";
import flatPath from "../assets/flat.svg";
import quarterNoteStemUpPath from "../assets/quarter-note-stem-up.svg";
import quarterNoteStemDownPath from "../assets/quarter-note-stem-down.svg";

import {
  Note,
  NoteStaffProps,
  Clef,
  Index,
  Ctx,
  Canvas,
  Coord,
  Columns,
  Octave,
} from "../types";

const getYPixels = (index: Index) => {
  return Math.floor((canvasHeight / rows) * index);
};

const getImage = (path: string) => {
  const img = new Image();
  img.src = path;
  return img;
};

const getScaledHeight = (scale: number) => {
  return Math.floor((canvasHeight / rows) * scale * 2);
};

const canvasWidth = Math.floor(96 * 15);
const canvasHeight = Math.floor(28.5 * 15);
const lineWidth = 2;

const rows = 38; // even numbers only
const middle = rows / 2;
const staffTop = middle - 6;
const staffBottom = middle + 2;

const naturals = 7;

const normalOctave = 4;
const bassOctave = 3;

const offset = Math.floor((canvasWidth / rows) * 4.3);
const staffTopY = getYPixels(staffTop);
const staffBottomY = getYPixels(staffBottom);

const clefX = Math.floor((canvasHeight / rows) * 2);

const gClefY = getYPixels(staffTop - 1) - lineWidth;
const gClefHeight = getScaledHeight(6);
const gClefWidth = Math.floor(gClefHeight * 0.4);
const gClef = getImage(gClefPath);

const baritoneClefY = getYPixels(staffTop - 4);
const cClefHeight = getScaledHeight(4);
const cClefWidth = Math.floor(cClefHeight * 0.75);
const cClef = getImage(cClefPath);

const fClefY = getYPixels(staffTop) + lineWidth;
const fClefHeight = getScaledHeight(3.25);
const fClefWidth = Math.floor(fClefHeight * 0.9);
const fClef = getImage(fClefPath);

const octaveSymbolHeight = getScaledHeight(1.5);

const legerLineWidth = Math.floor((canvasHeight / rows) * 2);

const accidentalHeight = getScaledHeight(1.5);
const accidentalWidth = Math.floor(accidentalHeight * 0.5);
const sharp = getImage(sharpPath);
const flat = getImage(flatPath);

const noteHeight = getScaledHeight(4);
const noteWidth = Math.floor(noteHeight * 0.5);
const quarterNoteStemUp = getImage(quarterNoteStemUpPath);
const quarterNoteStemDown = getImage(quarterNoteStemDownPath);

const clearHeight = getScaledHeight(5);

let prevHighlightNoteX: Coord | null = null;
let prevHighlightNoteY: Coord | null = null;

const getNoteStaffIndex = (note: Note, clef: Clef, averageOctave: Octave) => {
  const noteIndex = Math.round(note.index * 0.5834) - 26;
  const sharp = note.name[1] === "#" ? 1 : 0;
  const adjustedIndex = -noteIndex + sharp;

  if (clef === "treble") {
    return adjustedIndex + middle - 1 + naturals * (averageOctave - normalOctave + 1);
  } else if (clef === "alto") {
    return adjustedIndex + middle - 7 + naturals * (averageOctave - normalOctave + 1);
  } else if (clef === "baritone") {
    return adjustedIndex + middle - 11 + naturals * (averageOctave - normalOctave + 1);
  } else {
    return adjustedIndex + middle - 13 + naturals * (averageOctave - bassOctave + 1);
  }
};

const drawLine = (
  ctx: Ctx,
  x1: Coord,
  y1: Coord,
  x2: Coord,
  y2: Coord,
  width: number
) => {
  x1 = Math.floor(x1);
  y1 = Math.floor(y1);
  x2 = Math.floor(x2);
  y2 = Math.floor(y2);

  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
};

const fillImage = (
  ctx: Ctx,
  img: HTMLImageElement,
  x: Coord,
  y: Coord,
  width: number,
  height: number
) => {
  x = Math.floor(x);
  y = Math.floor(y);

  ctx.drawImage(img, x, y, width, height);
  ctx.globalCompositeOperation = "source-atop";
  ctx.fillRect(x, y, width, height);
  ctx.globalCompositeOperation = "source-over";
};

const drawStaff = (ctx: Ctx, columns: Columns) => {
  const bars = Math.floor(columns / 4);
  const segment = Math.floor((canvasWidth - offset) / columns);

  for (let i = staffTop; i <= staffBottom; i += 2) {
    const y = getYPixels(i);

    drawLine(ctx, 0, y, canvasWidth, y, lineWidth);
  }

  for (let i = 0; i < 2; i += 1) {
    const x = Math.floor(canvasWidth * i);

    drawLine(ctx, x, staffTopY, x, staffBottomY, lineWidth * 5);
  }

  for (let i = bars - 1; i > 0; i -= 1) {
    const x = Math.floor(segment * i * 4 + offset - segment * 0.5);

    drawLine(ctx, x, staffTopY, x, staffBottomY, lineWidth * 2.5);
  }
};

const drawOctaveSymbol = (
  ctx: Ctx,
  octaveDiff: Octave,
  x: Coord,
  y: Coord,
  clefHeight: number
) => {
  const octaveString = (Math.abs(7 * octaveDiff) + 1).toString();
  if (octaveDiff > 0) {
    ctx.textBaseline = "ideographic";
    ctx.fillText(octaveString, Math.floor(x), Math.floor(y));
  } else if (octaveDiff < 0) {
    ctx.textBaseline = "top";
    ctx.fillText(octaveString, Math.floor(x), Math.floor(y + clefHeight));
  }
};

const drawClef = (ctx: Ctx, clef: Clef, averageOctave: Octave) => {
  const octaveDiff =
    averageOctave - (clef === "bass" ? bassOctave : normalOctave);

  if (clef === "treble") {
    fillImage(ctx, gClef, clefX, gClefY, gClefWidth, gClefHeight);
    drawOctaveSymbol(
      ctx,
      octaveDiff,
      clefX + gClefWidth * 0.64,
      gClefY,
      gClefHeight
    );
  } else if (clef === "alto") {
    fillImage(ctx, cClef, clefX, staffTopY, cClefWidth, cClefHeight);
    drawOctaveSymbol(
      ctx,
      octaveDiff,
      clefX + cClefWidth * 0.4,
      staffTopY,
      cClefHeight
    );
  } else if (clef === "baritone") {
    fillImage(ctx, cClef, clefX, baritoneClefY, cClefWidth, cClefHeight);
    drawOctaveSymbol(
      ctx,
      octaveDiff,
      clefX + cClefWidth * 0.4,
      baritoneClefY,
      cClefHeight
    );
  } else {
    fillImage(ctx, fClef, clefX, fClefY, fClefWidth, fClefHeight);
    drawOctaveSymbol(
      ctx,
      octaveDiff,
      clefX + fClefWidth * 0.4,
      fClefY,
      fClefHeight
    );
  }
};

const drawLegerLines = (ctx: Ctx, x: Coord, noteStaffIndex: Index) => {
  const x1 = x - legerLineWidth;
  const x2 = x + legerLineWidth;

  if (noteStaffIndex > staffBottom) {
    for (let i = staffBottom + 1; i <= noteStaffIndex; i += 2) {
      const y = getYPixels(i);

      drawLine(ctx, x1, y, x2, y, lineWidth);
    }
  } else if (noteStaffIndex < staffTop) {
    for (let i = staffTop - 1; i >= noteStaffIndex; i -= 2) {
      const y = getYPixels(i);

      drawLine(ctx, x1, y, x2, y, lineWidth);
    }
  }
};

const drawNote = (ctx: Ctx, x: Coord, noteStaffIndex: Index) => {
  if (noteStaffIndex > middle - 2) {
    const y = getYPixels(noteStaffIndex - 7);

    fillImage(
      ctx,
      quarterNoteStemUp,
      x - noteWidth * 0.5,
      y,
      noteWidth,
      noteHeight
    );
  } else {
    const y = getYPixels(noteStaffIndex - 1);

    fillImage(
      ctx,
      quarterNoteStemDown,
      x - noteWidth * 0.5,
      y,
      noteWidth,
      noteHeight
    );
  }
};

const drawAccidental = (
  ctx: Ctx,
  x: Coord,
  noteStaffIndex: Index,
  note: Note
) => {
  const y = getYPixels(noteStaffIndex - 2);

  if (note.name[1] === "#") {
    fillImage(
      ctx,
      sharp,
      x - accidentalWidth * 2,
      y + accidentalHeight * 0.2,
      accidentalWidth,
      accidentalHeight
    );
  } else if (note.name[1] === "b") {
    fillImage(
      ctx,
      flat,
      x - accidentalWidth * 2,
      y,
      accidentalWidth,
      accidentalHeight
    );
  }
};

const drawBackground = (
  ctx: Ctx,
  clef: Clef,
  columns: Columns,
  averageOctave: Octave
) => {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  drawStaff(ctx, columns);
  drawClef(ctx, clef, averageOctave);
};

const drawForeground = (
  ctx: Ctx,
  noteArray: Note[],
  clef: Clef,
  start: number,
  columns: Columns,
  averageOctave: Octave
) => {
  const end =
    start + columns > noteArray.length ? noteArray.length : start + columns;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  for (let i = start; i < end; i += 1) {
    const note = noteArray[i];
    const noteStaffIndex = getNoteStaffIndex(note, clef, averageOctave);
    const x = ((canvasWidth - offset) / columns) * (i - start) + offset;

    drawLegerLines(ctx, x, noteStaffIndex);
    drawNote(ctx, x, noteStaffIndex);
    drawAccidental(ctx, x, noteStaffIndex, note);
  }
};

const drawHighlight = (
  ctx: Ctx,
  noteArray: Note[],
  clef: Clef,
  index: Index,
  columns: Columns,
  averageOctave: Octave
) => {
  const note = noteArray[index];
  const noteStaffIndex = getNoteStaffIndex(note, clef, averageOctave);
  const x = ((canvasWidth - offset) / columns) * (index % columns) + offset;

  if (prevHighlightNoteX && prevHighlightNoteY) {
    const clearWidth = Math.floor(canvasWidth / columns);
    ctx.clearRect(
      Math.floor(prevHighlightNoteX - clearWidth * 0.5),
      Math.floor(prevHighlightNoteY - clearHeight * 0.1),
      clearWidth,
      clearHeight
    );
  }

  drawNote(ctx, x, noteStaffIndex);
  drawAccidental(ctx, x, noteStaffIndex, note);

  prevHighlightNoteX = x;
  prevHighlightNoteY =
    noteStaffIndex > middle - 2
      ? getYPixels(noteStaffIndex - 7)
      : getYPixels(noteStaffIndex - 1);
};

export function NoteStaff(props: NoteStaffProps) {
  const layers: Canvas[] = [null, null, null];
  const guitarStringLabel = getGuitarStringLabel(props.guitarString);
  const startIndex = useComputed(() => {
    return Math.floor(props.index.value / props.columns) * props.columns;
  });
  const averageOctave = useComputed(() => {
    const indexSum = props.noteArray.value.reduce((sum, note) => {
      return sum + note.index;
    }, 0);
    const indexAverage = Math.floor(indexSum / props.noteArray.value.length);

    if (props.clef === "treble") {
      return Math.round((indexAverage - 8) / 12);
    } else if (props.clef === "alto") {
      return Math.round(indexAverage / 12);
    } else if (props.clef === "baritone") {
      return Math.ceil(indexAverage / 12);
    } else {
      return Math.ceil((indexAverage - 6) / 12);
    }
  });

  const getCanvas = (canvas: Canvas) => {
    if (!canvas) return null;
    const ctx = canvas.getContext("2d") as Ctx;
    ctx.textAlign = "center";
    return canvas;
  };

  useSignalEffect(() => {
    if (!layers[0]) return;
    const ctx = layers[0].getContext("2d") as Ctx;
    ctx.font = `${octaveSymbolHeight}px monospace`;
    ctx.fillStyle = props.colors.value.foreground;
    ctx.strokeStyle = props.colors.value.foreground;
    drawBackground(ctx, props.clef, props.columns, averageOctave.value);
  });

  useSignalEffect(() => {
    if (!layers[1]) return;
    const ctx = layers[1].getContext("2d") as Ctx;
    ctx.fillStyle = props.colors.value.foreground;
    ctx.strokeStyle = props.colors.value.foreground;
    drawForeground(
      ctx,
      props.noteArray.value,
      props.clef,
      startIndex.value,
      props.columns,
      averageOctave.value
    );
  });

  useSignalEffect(() => {
    if (!layers[2]) return;
    const ctx = layers[2].getContext("2d") as Ctx;
    ctx.fillStyle = props.colors.value.primary;
    drawHighlight(
      ctx,
      props.noteArray.value,
      props.clef,
      props.index.value,
      props.columns,
      averageOctave.value
    );
  });

  return (
    <>
      <section id="note-staff-section" className="section-large">
        <label id="note-staff-label">{guitarStringLabel}</label>
        {layers.map((_canvas, i) => {
          return (
            <canvas
              key={i}
              className="note-staff-canvas"
              ref={(r) => (layers[i] = getCanvas(r))}
              width={canvasWidth}
              height={canvasHeight}
              style={{
                zIndex: i,
              }}
            ></canvas>
          );
        })}
      </section>
    </>
  );
}
