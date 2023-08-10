/* eslint-disable react/react-in-jsx-scope */

import { useSignal } from "@preact/signals";

import { getOctaveStart, getOctaveEnd } from "../modules/helpers";

import { OptionsInputProps, Tuning, TuningString } from "../types";

const tuningInputPattern =
  "^((?:C#|Db|D#|Eb|F#|Gb|G#|Ab|A#|Bb|[A-G])[0-5]-?)+$";

const getTuningObject = (tuningString: TuningString) => {
  const splitString: string[] = tuningString.split("-");

  const tuningObject: Tuning[] = [];

  for (const str of splitString) {
    const obj = {
      note: str.substring(0, str.length - 1),
      octave: parseInt(str.substring(str.length - 1, str.length), 10),
    };
    tuningObject.push(obj);
  }
  return tuningObject;
};

const getTuningString = (inputObject: Tuning[]) => {
  let tuningString = "";

  for (const obj of inputObject) {
    tuningString += `${obj.note}${obj.octave}-`;
  }

  tuningString = tuningString.slice(0, -1);

  return tuningString;
};

export function TuningInput(props: OptionsInputProps) {
  const tuning = useSignal(props.userInput.tuning);
  const tuningString = useSignal(getTuningString(props.userInput.tuning));
  const startFret = useSignal(props.userInput.startFret);
  const endFret = useSignal(props.userInput.endFret);

  const tuningOnChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    if (input.validity.valid && input.value !== "") {
      tuning.value = getTuningObject(input.value);
      tuningString.value = input.value;
      props.setUserInput({
        tuning: tuning.value,
        startOctave: getOctaveStart(tuning.value, startFret.value),
        endOctave: getOctaveEnd(tuning.value, endFret.value),
      });
    } else {
      input.value = tuningString.value;
    }
  };

  const onKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      const input = e.target as HTMLInputElement;
      input.blur();
    }
  };

  return (
    <>
      <div id="tuning-input-wrapper">
        <label className="options-label">Tuning</label>
        <input
          id="tuning-input"
          className="options-input"
          type="textfield"
          pattern={tuningInputPattern}
          value={tuningString}
          onChange={tuningOnChange}
          onKeyPress={onKeyPress}
        />
      </div>
    </>
  );
}
