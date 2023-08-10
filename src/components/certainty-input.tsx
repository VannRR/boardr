/* eslint-disable react/react-in-jsx-scope */
import { CertaintyInputProps } from "../types";

const min = 0.7;
const max = 0.99;
const step = 0.01;

export function CertaintyInput(props: CertaintyInputProps) {
  const onChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    if (input.validity.valid && input.value !== "") {
      props.certaintyThreshold.value = parseFloat(input.value);
    } else {
      input.value = max.toString();
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
      <div id="certainty-input-wrapper">
        <label className="options-label" id="certainty-input-label">
          Pitch Certainty
        </label>
        <input
          type="number"
          id="certainty-input"
          className="options-input"
          min={min}
          max={max}
          step={step}
          value={props.certaintyThreshold}
          onChange={onChange}
          onKeyPress={onKeyPress}
        />
      </div>
    </>
  );
}
