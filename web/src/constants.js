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
  CapsLock: 55,  // G
  KeyQ: 56,      // G#
  KeyA: 57,      // A
  KeyW: 58,      // A#
  KeyS: 59,      // B
  KeyD: 60,      // C
  KeyR: 61,      // C#
  KeyF: 62,      // D
  KeyT: 63,      // D#
  KeyG: 64,      // E
  KeyH: 65,      // F
  KeyU: 66,      // F#
  KeyJ: 67,      // G
  KeyI: 68,      // G#
  KeyK: 69,      // A
  KeyO: 70,      // A#
  KeyL: 71,      // B
  Semicolon: 72, // C
  BracketLeft: 73, // C#
  Quote: 74,     // D
  BracketRight: 75, // D#
  Enter: 76,      // E
  KeyZ: 77,      // F
  KeyX: 78,      // F#
  KeyC: 79,      // G
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