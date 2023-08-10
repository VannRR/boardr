/* eslint-disable react/react-in-jsx-scope */

import { StartButtonProps } from "../types";

export function StartButton(props: StartButtonProps) {
  const toggleStart = () => {
    if (props.audioInputIsActive.value === true) {
      props.started.value = !props.started.value;
    }
  };

  return (
    <>
      <button id="start-button" className="button-large" onClick={toggleStart}>
        start
      </button>
    </>
  );
}
