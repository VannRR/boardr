<p align="center">
    <img width="180" src="https://raw.githubusercontent.com/vannrr/boardr/main/public/boardr.svg" alt="boardr logo">
</p>

# boardr

boardr is a simple single page web app for practicing the position of notes on a stringed
instrument's fret/finger board as well has learning the corresponding note on a musical staff. The pitch detection is done with the [Pitchy Library](https://github.com/ianprime0509/pitchy).

## Build

```shell
git clone https://github.com/vannrr/boardr
cd ./boardr
npm install
npm run build
```

## Run Locally

```shell
npm install http-server
http-server -o
```

## Instructions

1. Press the Enable button to open a audio input permission prompt.
2. Select the input you will be using and press Allow.
3. Enter the tuning of your instrument starting from the top string, valid formats are note: A-G, optional: b or # and octave: 0-5. (eg. Gb0 | G1 | G#2)
4. Select note display format, scientific shows a grid of notes using the same format as the tuning and the rest display the notes on a staff corresponding to that clef. (a number above or below a clef indicate if the clef is an octave higher or lower then normal 8 = 1, 15 = 2, 22 = 3 etc.)
5. Select the range on the fret/finger board you want to practice the first being the start and the second being the end. To practice the first twelve frets of a guitar select 0 (open string) and 12. (a fret is one semitone so if the string is C3 then 0 is C3, 1 is C#3, 2 is D3 etc.)
6. Select the input channel of your audio device to use. With a stereo input device 1 is the left channel and 2 is the right.
7. Press start, a randomized list of notes for each string will be generated.
8. If you want to see the current note you are playing click the current note button.
9. If the note is not being detected from your instrument try lowering the pitch certainty. (0.99 = 99% certainty)
10. The pitch meter displays the difference of your current note from the target note in semitones with the center being 0 difference.
11. As you play the correct note the next one with be highlighted until you play all the notes for that string then the next string will be displayed.

## License

This is free software, distributed under the
[MIT license](https://opensource.org/licenses/MIT).
