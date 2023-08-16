/* eslint-disable react/react-in-jsx-scope */

import { useSignal, useSignalEffect } from "@preact/signals";

import { Notes } from "../modules/notes";

import { NoteGrid } from "./note-grid-section";
import { NoteStaff } from "./note-staff-section";
import { CurrentNoteSection } from "./current-note-section";
import { PitchMeter } from "./pitch-meter";
import { CertaintyInput } from "./certainty-input";
import { StopButton } from "./stop-button";

import { AnimatedElementsProps, NoteStaffProps, Note } from "../types";

const notes = new Notes();
const totalNotes = 48; // multiples of 24 would be best
const columns = 12; // multiples of 4 would be best
const getNoteByFreqMarginOfError = 0.03; // 1.0 = 100%
const msPerInterval = 125;
const msUntilClearNote = 1000;
const ticksUntilClearNote = Math.floor(msUntilClearNote / msPerInterval);

let tick = 0;
let loopID = 0;
let prevNote: Note | null = null;
let flat = false;

// light theme
let primaryColor = "#6200EE";
let foregroundColor = "#121212";
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  // dark theme
  primaryColor = "#BB86FC";
  foregroundColor = "#e4e4e4";
}

const NotesDisplay = (props: NoteStaffProps) => {
  const grid = (
    <NoteGrid
      noteArray={props.noteArray}
      guitarString={props.guitarString}
      index={props.index}
      columns={props.columns}
      highlightColor={props.highlightColor}
    />
  );
  const staff = (
    <NoteStaff
      noteArray={props.noteArray}
      guitarString={props.guitarString}
      index={props.index}
      columns={props.columns}
      clef={props.clef}
      color={props.color}
      highlightColor={props.highlightColor}
    />
  );

  return props.clef === "scientific" ? grid : staff;
};

function AnimatedElementsStarted(props: AnimatedElementsProps) {
  const started = props.started;

  const audioInput = props.audioInput;
  const audioInputIsActive = props.audioInputIsActive;

  const pitchDetector = props.pitchDetector;

  const tuning = props.userInput.tuning;
  const startFret = props.userInput.startFret;
  const endFret = props.userInput.endFret;
  const notesDisplayFormat = props.userInput.notesDisplayFormat;

  const noteIndex = useSignal(0);
  const stringIndex = useSignal(0);
  const difference = useSignal(0);
  const shuffledFretboard = useSignal(
    notes.getShuffledFretboard(tuning, startFret, endFret, totalNotes)
  );
  const noteArray = useSignal(shuffledFretboard.value[stringIndex.value]);

  const currentNote = useSignal<Note | null>(null);

  const certaintyThreshold = useSignal(0.99);

  flat = notes.isFlat(tuning[0].note);

  const progressNote = (): void => {
    noteIndex.value += 1;
    if (noteIndex.value >= noteArray.value.length - 1) {
      noteIndex.value = 0;
      stringIndex.value += 1;
      if (stringIndex.value >= shuffledFretboard.value.length) {
        noteIndex.value = 0;
        stringIndex.value = 0;
        shuffledFretboard.value = notes.getShuffledFretboard(
          tuning,
          startFret,
          endFret,
          totalNotes
        );
      }
      noteArray.value = shuffledFretboard.value[stringIndex.value];
      flat = notes.isFlat(tuning[stringIndex.value].note);
    }
  };

  const processPitch = () => {
    audioInput.updateDataArray();

    const [frequency, certainty] = pitchDetector.findPitch(
      audioInput.getDataArray(),
      audioInput.getSampleRate()
    );

    const pendingNote =
      certainty > certaintyThreshold.value
        ? notes.getByFreq(frequency, flat, getNoteByFreqMarginOfError)
        : null;

    if (notes.isEqual(pendingNote, prevNote)) {
      currentNote.value = pendingNote;
    } else {
      tick += 1;
      if (tick >= ticksUntilClearNote) {
        currentNote.value = null;
        tick = 0;
      }
    }

    prevNote = pendingNote;

    const targetNote =
      shuffledFretboard.value[stringIndex.value][noteIndex.value];

    difference.value = notes.getDifference(currentNote.value, targetNote);

    if (notes.isEqual(currentNote.value, targetNote)) {
      progressNote();
    }
  };

  useSignalEffect(() => {
    if (loopID === 0) {
      loopID = setInterval(() => {
        audioInputIsActive.value = audioInput.isActive();
        processPitch();
      }, msPerInterval);
    }
    return (): void => {
      if (loopID !== 0) {
        clearInterval(loopID);
        loopID = 0;
      }
    };
  });

  return (
    <>
      <CurrentNoteSection currentNote={currentNote} />
      <section id="pitch-meter-and-certainty-section" className="section-small">
        <PitchMeter color={foregroundColor} difference={difference} />
        <CertaintyInput certaintyThreshold={certaintyThreshold} />
      </section>
      <StopButton started={started} audioInputIsActive={audioInputIsActive} />
      <NotesDisplay
        noteArray={noteArray}
        guitarString={shuffledFretboard.value.length - stringIndex.value}
        index={noteIndex}
        columns={columns}
        clef={notesDisplayFormat}
        color={foregroundColor}
        highlightColor={primaryColor}
      />
    </>
  );
}

export function AnimatedElements(props: AnimatedElementsProps) {
  if (
    props.started.value === true &&
    props.pitchDetector !== null &&
    props.audioInputIsActive.value === true
  ) {
    return (
      <>
        <AnimatedElementsStarted
          audioInput={props.audioInput}
          userInput={props.userInput}
          pitchDetector={props.pitchDetector}
          started={props.started}
          audioInputIsActive={props.audioInputIsActive}
        />
      </>
    );
  } else {
    return null;
  }
}
