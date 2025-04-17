// Define white and black notes with their corresponding MIDI note numbers
export const whiteNotes = [
  { note: "G", midi: 55 },
  { note: "A", midi: 57 },
  { note: "B", midi: 59 },
  { note: "C", midi: 60 },
  { note: "D", midi: 62 },
  { note: "E", midi: 64 },
  { note: "F", midi: 65 },
  { note: "G", midi: 67 },
  { note: "A", midi: 69 },
  { note: "B", midi: 71 },
  { note: "C", midi: 72 },
  { note: "D", midi: 74 },
  { note: "E", midi: 76 },
  { note: "F", midi: 77 },
  { note: "G", midi: 79 },
];

export const blackNotes = [
  { note: "G#", midi: 56 },
  { note: "A#", midi: 58 },
  { note: null, midi: null },
  { note: "C#", midi: 61 },
  { note: "D#", midi: 63 },
  { note: null, midi: null },
  { note: "F#", midi: 66 },
  { note: "G#", midi: 68 },
  { note: "A#", midi: 70 },
  { note: null, midi: null },
  { note: "C#", midi: 73 },
  { note: "D#", midi: 75 },
  { note: null, midi: null },
  { note: "F#", midi: 78 },
];

export const colors = [
  "#00FFFF", // cyan
  "#0000FF", // blue
  "#FF1493", // dark pink
  "#FF0000", // red
  "#FFA500", // orange
  "#FFFF00", // yellow
  "#00FF00", // green
];

export const keyMap = {
  Tab: 55, // G
  Digit1: 56, // G#
  KeyQ: 57, // A
  Digit2: 58, // A#
  KeyW: 59, // B
  KeyE: 60, // C
  Digit4: 61, // C#
  KeyR: 62, // D
  Digit5: 63, // D#
  KeyT: 64, // E
  KeyY: 65, // F
  Digit7: 66, // F#
  KeyU: 67, // G
  Digit8: 68, // G#
  KeyI: 69, // A
  Digit9: 70, // A#
  KeyO: 71, // B
  KeyP: 72, // C
  Minus: 73, // C#
  BracketLeft: 74, // D
  Equal: 75, // D#
  BracketRight: 76, // E
  Backslash: 77, // F
  Backspace: 78, // F#
  Enter: 79, // G
};

// Pre-calculate all note properties
export const noteLookup = {};
const totalWhiteKeys = whiteNotes.length;
const spacing = 100 / totalWhiteKeys;

// Add white notes to lookup
whiteNotes.forEach(({ note, midi }, index) => {
  const left = spacing * index + spacing / 2;
  noteLookup[midi] = {
    note,
    midi,
    position: [(left - 50) * 0.6, -5, 8],
    color: colors[index % 7],
    isBlackKey: false
  };
});

// Add black notes to lookup
blackNotes.forEach(({ note, midi }, index) => {
  if (!note) return;
  const left = spacing * index + spacing;
  noteLookup[midi] = {
    note,
    midi,
    position: [(left - 50) * 0.6, -5, 8],
    color: "#333333",
    isBlackKey: true
  };
});