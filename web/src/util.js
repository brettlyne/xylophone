export const getContrastColor = (hexColor) => {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Calculate perceived brightness (using relative luminance)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 128 ? "black" : "white";
};

let context;
export function getAudioContext() {
  context ??= new AudioContext();
  return context;
}
