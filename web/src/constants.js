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
  KeyY: 65,      // F
  KeyH: 66,      // F#
  KeyJ: 67,      // G
  KeyK: 68,      // G#
  KeyL: 69,      // A
  KeyP: 70,      // A#
  Semicolon: 71, // B
  Quote: 72,     // C
  BracketRight: 73, // C#
  Enter: 74,     // D
  Backslash: 75, // D#
  ShiftRight: 76, // E
  KeyZ: 77,      // F
  KeyX: 78,      // F#
  KeyC: 79,      // G
};