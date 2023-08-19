/* eslint-disable react/react-in-jsx-scope */
import { useSignal, useSignalEffect } from "@preact/signals";
import { PitchDetector } from "pitchy";

import { AudioInput } from "./modules/audio-input";

import { ThemeSwitchButton } from "./components/theme-switch-button";
import { AnimatedElements } from "./components/animated-elements";
import { Options } from "./components/options";

import "./app.css";

import { SetUserInput, UserInput } from "./types";

const userInput: UserInput = {
  tuning: [
    { note: "E", octave: 2 },
    { note: "A", octave: 2 },
    { note: "D", octave: 3 },
    { note: "G", octave: 3 },
    { note: "B", octave: 3 },
    { note: "E", octave: 4 },
  ],
  startFret: 0,
  endFret: 22,
  startOctave: 2,
  endOctave: 6,
  notesDisplayFormat: "scientific",
};
const audioInput = new AudioInput();

const pitchDetector = PitchDetector.forFloat32Array(audioInput.getFFTSize());

const setUserInput: SetUserInput = (newValues) => {
  for (const [key, value] of Object.entries(newValues)) {
    if (value !== undefined) {
      userInput[key as keyof UserInput] = value as never;
    }
  }
};

export function App() {
  const started = useSignal(false);
  const darkMode = useSignal(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const audioInputIsActive = useSignal(audioInput.isActive());

  useSignalEffect(() => {
    if (darkMode.value) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
  });

  useSignalEffect(() => {
    if (audioInputIsActive.value === false && started.value === true) {
      started.value = false;
    }
  });

  return (
    <>
      <ThemeSwitchButton darkMode={darkMode} />
      <AnimatedElements
        started={started}
        audioInput={audioInput}
        userInput={userInput}
        audioInputIsActive={audioInputIsActive}
        pitchDetector={pitchDetector}
        darkMode={darkMode}
      />
      <Options
        started={started}
        audioInput={audioInput}
        userInput={userInput}
        audioInputIsActive={audioInputIsActive}
        setUserInput={setUserInput}
      />
    </>
  );
}
