/* eslint-disable react/react-in-jsx-scope */

import { useSignal } from "@preact/signals";

import { getOctaveStart, getOctaveEnd } from "../modules/helpers";

import { OptionsInputProps } from "../types";

const minFret = 0;
const maxFret = 24;

export function FretRangeInput(props: OptionsInputProps) {
  const tuning = useSignal(props.userInput.tuning);
  const startFret = useSignal(props.userInput.startFret);
  const endFret = useSignal(props.userInput.endFret);

  const startFretOnChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const pendingValue = parseInt(input.value, 10);
    if (input.validity.valid && input.value !== "") {
      if (pendingValue > endFret.value) {
        endFret.value = pendingValue;
      }
      startFret.value = pendingValue;
      props.setUserInput({
        startFret: pendingValue,
        startOctave: getOctaveStart(tuning.value, pendingValue),
      });
    } else {
      input.value = startFret.value.toString();
    }
  };

  const endFretOnChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const pendingValue = parseInt(input.value, 10);
    if (input.validity.valid && input.value !== "") {
      if (pendingValue < startFret.value) {
        startFret.value = pendingValue;
      }
      endFret.value = pendingValue;
      props.setUserInput({
        endFret: pendingValue,
        endOctave: getOctaveEnd(tuning.value, pendingValue),
      });
    } else {
      input.value = endFret.value.toString();
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
      <div id="fret-range-input-wrapper">
        <label className="options-label">Fret Range</label>
        <input
          id="start-fret"
          className="fret-range-input options-input"
          type="number"
          min={minFret}
          max={maxFret}
          value={startFret}
          onChange={startFretOnChange}
          onKeyPress={onKeyPress}
        />
        <input
          id="end-fret"
          className="fret-range-input options-input"
          type="number"
          min={minFret}
          max={maxFret}
          value={endFret}
          onChange={endFretOnChange}
          onKeyPress={onKeyPress}
        />
      </div>
    </>
  );
}
