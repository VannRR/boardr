/* eslint-disable react/react-in-jsx-scope */

import { StartButtonProps } from "../types";

export function StopButton(props: StartButtonProps) {
  const toggleStart = () => {
    if (props.audioInputIsActive.value === true) {
      props.started.value = !props.started.value;
    }
  };

  return (
    <>
      <button id="stop-button" className="button-large" onClick={toggleStart}>
        stop
      </button>
    </>
  );
}
