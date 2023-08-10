<p align="center">
    <img width="180" src="https://raw.githubusercontent.com/vannrr/boardr/main/public/boardr.svg" alt="boardr logo">
</p>

# boardr

boardr is a simple, single-page web app that helps you practice the position of notes on a stringed instrument's fret/fingerboard and learn the corresponding notes on a musical staff. The app uses the [Pitchy Library](https://github.com/ianprime0509/pitchy) for pitch detection.

## Build

```shell
git clone https://github.com/vannrr/boardr
cd ./boardr
npm install
npm run build
```

## Run Locally

```shell
npm run preview
```

## Instructions

1. Press the **Enable** button to open an audio input permission prompt.
2. Select the input you'll be using and press **Allow**.
3. Enter the tuning of your instrument starting from the top string. Valid formats are note (A-G), optional (b or #), and octave (0-5). For example: Gb0, G1, or G#2.
4. Select the note display format. The **Scientific** option shows a grid of notes using the same format as the tuning, while other options display notes on a staff corresponding to that clef. A number above or below a clef indicates if the clef is an octave higher or lower than normal (8 = 1, 15 = 2, 22 = 3, etc.).
5. Select the range on the fret/fingerboard you want to practice, with the first number being the start and the second being the end. To practice the first twelve frets of a guitar, select 0 (open string) and 12. Each fret is one semitone, so if the string is C3, then 0 is C3, 1 is C#3, 2 is D3, etc.
6. Select the input channel of your audio device to use. For a stereo input device, 1 is the left channel and 2 is the right.
7. Press **Start** to generate a randomized list of notes for each string.
8. Click the **Current Note** button to see the note you're currently playing.
9. If your instrument's note isn't being detected, try lowering the pitch certainty (0.99 = 99% certainty).
10. The pitch meter displays the difference between your current note and the target note in semitones, with the center being 0 difference.
11. As you play each correct note, the next one will be highlighted until you've played all notes for that string, then the next string will be displayed.

## License

This is free software, distributed under the
[MIT license](https://opensource.org/licenses/MIT).
