import { PitchDetector } from "pitchy";
import { Signal } from "@preact/signals";

import { AudioInput } from "./modules/audio-input";

type Canvas = HTMLCanvasElement | null;
type Ctx = CanvasRenderingContext2D;
type Coord = number;
type Clef = string;
type Index = number;
type Columns = number;
type ChannelCount = number;
type Color = string;
type Freq = number;
type NoteName = string;
type Octave = number;
type Started = boolean;
type Flat = boolean;
type Diff = number;
type GuitarStr = number;
type Fret = number;
type NotesDF = string;
type TotalNotes = number;
type TuningString = string;
type SetUserInput = (newValues: Partial<UserInput>) => void;
type StartApp = () => void;

export interface Note {
  frequency: Freq;
  name: NoteName;
  octave: Octave;
  index: Index;
}

export interface Tuning {
  note: NoteName;
  octave: Octave;
}

export interface UserInput {
  tuning: Tuning[];
  startFret: Fret;
  endFret: Fret;
  startOctave: Octave;
  endOctave: Octave;
  notesDisplayFormat: NotesDF;
}

export interface AnimatedElementsProps {
  audioInput: AudioInput;
  pitchDetector: PitchDetector;
  userInput: UserInput;
  started: Signal<Started>;
  audioInputIsActive: Signal<boolean>;
  darkMode: Signal<boolean>;
}

export interface CertaintyInputProps {
  certaintyThreshold: Signal<number>;
}

interface CurrentNoteSectionProps {
  currentNote: Signal<Note | null>;
}

export interface NoteGridProps {
  noteArray: Signal<Note[]>;
  guitarString: GuitarStr;
  index: Signal<Index>;
  columns: Columns;
  colors: Signal<{ primary: Color, foreground: Color }>;
}

export interface NoteStaffProps extends NoteGridProps {
  clef: Clef;
}

interface OptionsInputProps {
  userInput: UserInput;
  setUserInput: SetUserInput;
}

interface OptionsNotStartedProps extends OptionsInputProps {
  audioInput: AudioInput;
}

interface OptionsNoAudioInputProps {
  audioInput: AudioInput;
  audioInputIsActive: Signal<boolean>;
}

interface OptionsProps extends OptionsInputProps {
  audioInput: AudioInput;
  started: Signal<Started>;
  audioInputIsActive: Signal<boolean>;
}

interface ChannelSelectProps {
  audioInput: AudioInput;
}

interface PitchMeterProps {
  difference: Signal<Diff>;
  colors: Signal<{ primary: Color, foreground: Color }>;
}

interface StartButtonProps {
  started: Signal<Started>;
  audioInputIsActive: Signal<boolean>;
}

interface ThemeSwitchButtonProps {
  darkMode: Signal<boolean>;
}
