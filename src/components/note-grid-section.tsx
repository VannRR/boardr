/* eslint-disable react/react-in-jsx-scope */
import { getGuitarStringLabel } from "../modules/helpers";

import { Color, Columns, Index, Note, NoteGridProps } from "../types";

const Grid = (props: {
  noteArray: Note[];
  index: Index;
  columns: Columns;
  highlightColor: Color;
  id: string;
}) => {
  let gridRow = 0;
  const grid = props.noteArray.map((note, i) => {
    if (i % props.columns === 0) gridRow += 1;
    const textDecoration = props.index === i ? "underline" : "inherit";
    const color = props.index === i ? props.highlightColor : "inherit";
    const text = note.name + note.octave;
    const node = (
      <div className="node" key={i} style={{ textDecoration, color, gridRow }}>
        {text}
      </div>
    );
    return node;
  });
  return <div id={props.id}>{grid}</div>;
};

export function NoteGrid(props: NoteGridProps) {
  const guitarString = getGuitarStringLabel(props.guitarString);

  return (
    <>
      <section id="note-grid-section" className="section-large">
        <label id="note-grid-label">{guitarString}</label>
        <Grid
          id="note-grid"
          noteArray={props.noteArray.value}
          index={props.index.value}
          columns={props.columns}
          highlightColor={props.highlightColor}
        />
      </section>
    </>
  );
}
