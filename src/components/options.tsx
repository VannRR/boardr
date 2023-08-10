/* eslint-disable react/react-in-jsx-scope */

import { TuningInput } from "./tuning-input";
import { FretRangeInput } from "./fret-range-input";
import { ChannelSelect } from "./channel-select";
import { NotesDisplayFormatSelect } from "./notes-display-format-select";
import { StartButton } from "./start-button";

import {
  OptionsProps,
  OptionsNotStartedProps,
  OptionsNoAudioInputProps,
} from "../types";

const githubLink = (
  <a id="github-link" href="https://github.com/vannrr/boardr#readme">
    Project's Github
  </a>
);

function OptionsNoAudioInput(props: OptionsNoAudioInputProps) {
  const onClick = async () => {
    await props.audioInput.setup();
    props.audioInputIsActive.value = props.audioInput.isActive();
  };

  return (
    <section className="options-section section-small">
      <label className="options-label">
        Please enable audio input to use this app.
      </label>
      <button className="button-normal" onClick={onClick}>
        Enable
      </button>
    </section>
  );
}

function OptionsNotStarted(props: OptionsNotStartedProps) {
  return (
    <section className="options-section section-small">
      <TuningInput
        userInput={props.userInput}
        setUserInput={props.setUserInput}
      />
      <NotesDisplayFormatSelect
        userInput={props.userInput}
        setUserInput={props.setUserInput}
      />
      <FretRangeInput
        userInput={props.userInput}
        setUserInput={props.setUserInput}
      />
      <ChannelSelect audioInput={props.audioInput} />
    </section>
  );
}

export function Options(props: OptionsProps) {
  if (
    props.started.value === false &&
    props.audioInputIsActive.value === true
  ) {
    return (
      <>
        <OptionsNotStarted
          userInput={props.userInput}
          audioInput={props.audioInput}
          setUserInput={props.setUserInput}
        />
        <StartButton
          started={props.started}
          audioInputIsActive={props.audioInputIsActive}
        />
        {githubLink}
      </>
    );
  } else if (
    props.started.value === false &&
    props.audioInputIsActive.value === false
  ) {
    return (
      <>
        <OptionsNoAudioInput
          audioInput={props.audioInput}
          audioInputIsActive={props.audioInputIsActive}
        />
        {githubLink}
      </>
    );
  } else {
    return null;
  }
}
