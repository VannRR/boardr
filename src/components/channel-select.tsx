/* eslint-disable react/react-in-jsx-scope */

import { useSignal } from "@preact/signals";

import { ChannelSelectProps } from "../types";

export function ChannelSelect(props: ChannelSelectProps) {
  const audioInput = props.audioInput;
  const channelCount = audioInput.getChannelCount();
  const channel = useSignal(audioInput.getActiveChannel());
  const options = [];
  for (let i = 0; i < channelCount; i++) {
    options.push(<option value={i}>{i + 1}</option>);
  }

  const onChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const value = parseInt(input.value, 10);
    channel.value = value;
    audioInput.setActiveChannel(value);
  };

  return (
    <>
      <div id="channel-select-wrapper">
        <label className="options-label">Input Channel</label>
        <select
          id="channel-select"
          className="options-input"
          value={channel}
          onChange={onChange}
        >
          {options}
        </select>
      </div>
    </>
  );
}
