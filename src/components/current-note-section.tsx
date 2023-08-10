/* eslint-disable react/react-in-jsx-scope */
import { useSignal, useComputed } from "@preact/signals";

import { CurrentNoteSectionProps } from "../types";

export function CurrentNoteSection(props: CurrentNoteSectionProps) {
  const hidden = useSignal(true);
  const cn = props.currentNote.value;
  const noteText = cn !== null ? cn.name + cn.octave : "?";

  const buttonText = useComputed(() => {
    return hidden.value === false ? "Current Note ▲" : "Current Note ▼";
  });

  return (
    <div id="current-note-wrapper">
      <button
        id="current-note-button"
        className="button-normal"
        onClick={() => (hidden.value = !hidden.value)}
      >
        {buttonText}
      </button>
      <section id="current-note-section" hidden={hidden}>
        {noteText}
      </section>
    </div>
  );
}
