import {
  Flat,
  Freq,
  Fret,
  Index,
  Note,
  NoteName,
  Octave,
  TotalNotes,
  Tuning,
} from "../types";

export class Notes {
  private tones: number;
  private placeholder: string;
  private names: string;
  private sharpSymbol: string;
  private flatSymbol: string;
  private baseFreq: Float32Array;
  constructor() {
    this.tones = 12;
    this.placeholder = "*";
    this.names = "C*D*EF*G*A*B";
    this.sharpSymbol = "#";
    this.flatSymbol = "b";
    this.baseFreq = new Float32Array(this.tones);
    this.baseFreq.set([
      16.35, 17.32, 18.35, 19.45, 20.6, 21.83, 23.12, 24.5, 25.96, 27.5, 29.14,
      30.87,
    ]);
  }

  private testIndex(index: Index) {
    if (index < 0 || !Number.isInteger(index)) {
      throw new Error("Invalid index");
    }
  }

  private testName(name: NoteName) {
    if (!this.isNatural(name) && !this.isSharp(name) && !this.isFlat(name)) {
      throw new Error(
        "Invalid note name, must be natural, sharp or flat with capital letter"
      );
    }
  }

  private testOctave(octave: Octave) {
    if (octave < 0 || !Number.isInteger(octave)) {
      throw new Error("Invalid octave, must be positive integer");
    }
  }

  private testFreq(frequency: Freq) {
    if (frequency < 0) {
      throw new Error("Invalid frequency, must be positive");
    }
  }

  isSharp(name: NoteName) {
    return (
      name.length === 2 &&
      name[0] !== this.placeholder &&
      name[1] === this.sharpSymbol &&
      this.names.indexOf(name[0]) !== -1
    );
  }

  isFlat(name: NoteName) {
    return (
      name.length === 2 &&
      name[0] !== this.placeholder &&
      name[1] === this.flatSymbol &&
      this.names.indexOf(name[0]) !== -1
    );
  }

  isNatural(name: NoteName) {
    return (
      name.length === 1 &&
      name[0] !== this.placeholder &&
      this.names.indexOf(name[0]) !== -1
    );
  }

  isEqual(noteA: Note | null, noteB: Note | null) {
    return noteA && noteB && noteA.frequency === noteB.frequency;
  }

  getIndex(name: NoteName, octave: Octave) {
    this.testName(name);
    this.testOctave(octave);

    const sharpOrFlat = this.isSharp(name) ? 1 : this.isFlat(name) ? -1 : 0;
    const baseIndex = this.names.indexOf(name[0]) + sharpOrFlat;
    return baseIndex + this.tones * octave;
  }

  getFreq(name: NoteName, octave: Octave) {
    const index = this.getIndex(name, octave);
    return this.baseFreq[index % this.tones] * Math.pow(2, octave);
  }

  get(name: NoteName, octave: Octave) {
    const index = this.getIndex(name, octave);
    const frequency = this.getFreq(name, octave);
    return { frequency, name, octave, index } as Note;
  }

  getNameByIndex(index: Index, flat: Flat) {
    this.testIndex(index);
    const name = this.names[index % this.tones];
    if (flat && name === this.placeholder) {
      return this.names[(index + 1) % this.tones] + this.flatSymbol;
    } else if (name === this.placeholder) {
      return this.names[(index - 1) % this.tones] + this.sharpSymbol;
    } else {
      return name;
    }
  }

  getOctaveByIndex(index: Index) {
    this.testIndex(index);
    return Math.floor(index / this.tones);
  }

  getByIndex(index: Index, flat: Flat) {
    const name = this.getNameByIndex(index, flat);
    const octave = this.getOctaveByIndex(index);
    const frequency = this.getFreq(name, octave);
    return { frequency, name, octave, index } as Note;
  }

  getOctaveByFreq(frequency: Freq) {
    this.testFreq(frequency);
    return Math.floor(Math.log2(frequency / this.baseFreq[0]));
  }

  getByFreq(frequency: Freq, flat: Flat, marginOfError = 0) {
    const octave = this.getOctaveByFreq(frequency);

    for (let i = 0; i < this.baseFreq.length; i += 1) {
      const pendingFreq = this.baseFreq[i] * Math.pow(2, octave);
      const minRange = pendingFreq - pendingFreq * marginOfError;
      const maxRange = pendingFreq + pendingFreq * marginOfError;
      if (minRange <= frequency && maxRange >= frequency) {
        return {
          frequency: pendingFreq,
          name: this.getNameByIndex(i, flat),
          octave,
          index: i + this.tones * octave,
        } as Note;
      }
    }

    return null;
  }

  getDifference(noteA: Note | null, noteB: Note | null) {
    if (noteA && noteB) {
      const difference = (noteA.index - noteB.index) / this.tones;
      if (difference > 1) return 1;
      else if (difference < -1) return -1;
      else return difference;
    }
    return 0;
  }

  getInRange(
    startNote: NoteName,
    startOctave: Octave,
    endNote: NoteName,
    endOctave: Octave,
    flat: Flat,
    totalNotes?: TotalNotes
  ) {
    const notesInRange: Note[] = [];
    const startIndex = this.getIndex(startNote, startOctave);
    const endIndex = this.getIndex(endNote, endOctave);

    if (endIndex < startIndex) {
      throw new Error("Invalid range");
    }

    const pendingRange = endIndex - startIndex;
    const totalNotesInRange = pendingRange !== 0 ? pendingRange : 1;

    totalNotes = totalNotes || totalNotesInRange;

    if (totalNotes < 0 || !Number.isInteger(totalNotes)) {
      throw new Error("Invalid total notes");
    }

    const repeat = Math.ceil(totalNotes / totalNotesInRange);

    for (let i = 0; i < repeat; i += 1) {
      for (let j = startIndex; j <= endIndex; j += 1) {
        if (notesInRange.length >= totalNotes) break;
        const note = this.getByIndex(j, flat);
        notesInRange.push(note);
      }
    }

    return notesInRange;
  }

  getShuffledInRange(
    startNote: NoteName,
    startOctave: Octave,
    endNote: NoteName,
    endOctave: Octave,
    flat: Flat,
    totalNotes?: TotalNotes
  ) {
    const shuffledNotesInRange = this.getInRange(
      startNote,
      startOctave,
      endNote,
      endOctave,
      flat,
      totalNotes
    );

    for (let i = shuffledNotesInRange.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledNotesInRange[i], shuffledNotesInRange[j]] = [
        shuffledNotesInRange[j],
        shuffledNotesInRange[i],
      ];
    }

    return shuffledNotesInRange;
  }

  getShuffledFretboard(
    tuning: Tuning[],
    fretStart: Fret,
    fretEnd: Fret,
    totalNotes?: TotalNotes
  ) {
    const shuffledFretboard: Note[][] = [];
    tuning.forEach((obj) => {
      const flat = this.isFlat(obj.note);
      const index = this.getIndex(obj.note, obj.octave);
      const start = this.getByIndex(index + fretStart, flat);
      const end = this.getByIndex(index + fretEnd, flat);

      shuffledFretboard.push(
        this.getShuffledInRange(
          start.name,
          start.octave,
          end.name,
          end.octave,
          flat,
          totalNotes
        )
      );
    });
    return shuffledFretboard;
  }
}
