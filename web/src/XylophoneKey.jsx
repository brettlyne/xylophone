import { getContrastColor } from "./util";
import { keyMap, symbolMap } from "./constants";

const XylophoneKey = ({
  left,
  color,
  note,
  midiNote,
  isBlackKey = false,
  onPlay,
}) => {
  const keyStyle = {
    position: "absolute",
    left: `${left}%`,
    bottom: isBlackKey ? "16%" : "1%",
    width: isBlackKey ? "4%" : "6%",
    height: isBlackKey ? "15%" : "30%",
    backgroundColor: color,
    border: "1px solid rgba(0,0,0,0.2)",
    borderRadius: "0 0 8px 8px",
    zIndex: isBlackKey ? 2 : 1,
    transform: isBlackKey ? "translateX(-50%)" : "translateX(-50%)",
    cursor: "pointer",
  };

  const handleMouseDown = () => {
    onPlay(midiNote);
  };

  // Find the key in keyMap that matches this midiNote
  const keyCode = Object.entries(keyMap).find(([_, value]) => value === midiNote)?.[0];
  const symbol = keyCode ? symbolMap[keyCode] : '';

  return (
    <div 
      style={keyStyle} 
      onMouseDown={handleMouseDown}
      className={`midi-${midiNote}`}
    >
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          width: "100%",
          textAlign: "center",
          color: isBlackKey ? "white" : getContrastColor(color),
          fontWeight: 500,
          fontSize: "1.2rem",
        }}
      >
        {note}
      </div>
      {!isBlackKey && (
        <div
          style={{
            position: "absolute",
            top: "60%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: getContrastColor(color),
            fontWeight: 500,
            fontSize: "1rem",
            padding: "4px 8px",
            border: "3px solid",
            borderColor: getContrastColor(color),
            borderRadius: "4px",
            minWidth: "24px",
            textAlign: "center",
          }}
        >
          {symbol}
        </div>
      )}
    </div>
  );
};

export default XylophoneKey;
