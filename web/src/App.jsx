import { Canvas } from "@react-three/fiber";
import "./App.css";
import { useEffect, useState, useCallback } from "react";

const getContrastColor = (hexColor) => {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Calculate perceived brightness (using relative luminance)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 128 ? "black" : "white";
};

// Simple sine wave beep
const createBeep = (context, frequency) => {
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  gainNode.gain.value = 0.1;
  oscillator.frequency.value = frequency;
  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  return oscillator;
};

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
    console.log(`MIDI Note: ${midiNote}`);
    onPlay(midiNote);
  };

  return (
    <div style={keyStyle} onMouseDown={handleMouseDown}>
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
    </div>
  );
};

const Background = () => {
  return (
    <mesh>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial color="#cecece" />
    </mesh>
  );
};

const Xylophone = () => {
  const [audioContext, setAudioContext] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const initAudio = useCallback(async () => {
    if (!audioContext && !isLoading) {
      setIsLoading(true);
      try {
        const context = new AudioContext();
        await context.resume();
        console.log("AudioContext created and resumed");

        // Test beep
        const beep = createBeep(context, 440);
        beep.start();
        setTimeout(() => beep.stop(), 200);

        setAudioContext(context);
        setIsReady(true);
      } catch (error) {
        console.error("Error in audio setup:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [audioContext, isLoading]);

  useEffect(() => {
    return () => {
      if (audioContext && audioContext.state !== "closed") {
        audioContext.close();
      }
    };
  }, [audioContext]);

  const playNote = useCallback(
    async (midiNote) => {
      if (!isReady || isLoading || !audioContext) return;

      try {
        if (audioContext.state === "suspended") {
          await audioContext.resume();
        }

        // Convert MIDI note to frequency: 440 * 2^((n-69)/12)
        const frequency = 440 * Math.pow(2, (midiNote - 69) / 12);
        console.log("Playing frequency:", frequency, "Hz");

        const beep = createBeep(audioContext, frequency);
        beep.start();
        setTimeout(() => beep.stop(), 200);
      } catch (error) {
        console.error("Error playing note:", error);
      }
    },
    [audioContext, isReady, isLoading]
  );

  // Define white and black notes with their corresponding MIDI note numbers
  const whiteNotes = [
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

  const blackNotes = [
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

  const colors = [
    "#00FFFF", // cyan
    "#0000FF", // blue
    "#FF1493", // dark pink
    "#FF0000", // red
    "#FFA500", // orange
    "#FFFF00", // yellow
    "#00FF00", // green
  ];

  // Calculate positions for white keys
  const totalWhiteKeys = whiteNotes.length;
  const spacing = 100 / totalWhiteKeys;

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {!isReady && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          padding: "1rem",
          background: "#333",
          color: "white",
          textAlign: "center",
          zIndex: 1000
        }}>
          <button
            onClick={initAudio}
            disabled={isLoading}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "1rem",
              cursor: isLoading ? "wait" : "pointer"
            }}
          >
            {isLoading ? "Loading..." : "Click to Enable Audio"}
          </button>
        </div>
      )}
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {/* White keys */}
        {whiteNotes.map(({ note, midi }, index) => {
          const colorIndex = index % 7;
          const left = spacing * index + spacing / 2;
          return (
            <XylophoneKey
              key={`white-${index}`}
              left={left}
              color={colors[colorIndex]}
              note={note}
              midiNote={midi}
              onPlay={playNote}
            />
          );
        })}

        {/* Black keys */}
        {blackNotes.map(({ note, midi }, index) => {
          if (!note) return null;
          const left = spacing * index + spacing;
          return (
            <XylophoneKey
              key={`black-${index}`}
              left={left}
              color="#333333"
              note={note}
              midiNote={midi}
              isBlackKey={true}
              onPlay={playNote}
            />
          );
        })}
      </div>
    </div>
  );
};

function App() {
  return (
    <div
      className="App"
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <ambientLight intensity={0.5} />
        <Background />
      </Canvas>
      <Xylophone />
    </div>
  );
}

export default App;
