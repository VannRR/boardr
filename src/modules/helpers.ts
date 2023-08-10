import { GuitarStr, Tuning, Fret } from "../types";

export const getGuitarStringLabel = (guitarString: GuitarStr) => {
  const ordinal = ["th", "st", "nd", "rd"][guitarString % 10] || "th";
  return guitarString + ordinal + " String";
};

export const getOctaves = (tuning: Tuning[]) => {
  const octaves = new Uint8Array(tuning.length);
  for (let i = 0; i < tuning.length; i++) {
    octaves[i] = tuning[i].octave;
  }
  return octaves;
};

export const getOctaveStart = (tuning: Tuning[], startFret: Fret) => {
  const octaves = getOctaves(tuning);
  const lowest = Math.min(...octaves);
  return lowest + Math.floor(startFret / 12);
};

export const getOctaveEnd = (tuning: Tuning[], endFret: Fret) => {
  const octaves = getOctaves(tuning);
  const highest = Math.max(...octaves);
  return highest + Math.ceil(endFret / 12);
};
