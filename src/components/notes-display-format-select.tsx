/* eslint-disable react/react-in-jsx-scope */

import { useSignal } from "@preact/signals";

import { OptionsInputProps } from "../types";

const values = ["scientific", "treble", "alto", "baritone", "bass"];
const options = values.map((value, i) => {
  return (
    <option key={i} value={value}>
      {value}
    </option>
  );
});

export function NotesDisplayFormatSelect(props: OptionsInputProps) {
  const currentValue = useSignal(props.userInput.notesDisplayFormat);

  const selectOption = (e: Event) => {
    const element = e.target as HTMLSelectElement;
    props.setUserInput({ notesDisplayFormat: element.value });
    currentValue.value = element.value;
  };

  return (
    <>
      <div id="notes-display-format-select-wrapper">
        <label className="options-label">Note Display</label>
        <select
          id="notes-display-format-select"
          className="options-input"
          value={currentValue}
          onChange={selectOption}
        >
          {options}
        </select>
      </div>
    </>
  );
}
