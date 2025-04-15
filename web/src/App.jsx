import { Canvas } from "@react-three/fiber";
import "./App.css";
import { useState, useRef } from "react";
import { whiteNotes, blackNotes, colors } from "./constants";
import XylophoneKey from "./XylophoneKey";
import { getAudioContext } from "./util";
import { Mallet, Reverb } from "smplr";

const Background = () => {
  return (
    <mesh>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial color="#cecece" />
    </mesh>
  );
};

const Xylophone = () => {
  const [instrument, setInstrument] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const reverb = useRef(null);

  const setup = () => {
    const context = getAudioContext();
    reverb.current = new Reverb(context);
    const newPiano = new Mallet(context, {
      instrument: "Xylophone - Soft Mallets",
      volume: 100,
    });
    newPiano.output.addEffect("reverb", reverb.current, 0.75);
    setInstrument(newPiano);

    newPiano.load.then(() => {
      console.log("loaded");
      setIsReady(true);
    });
  };

  const playNote = (note) => {
    if (!instrument) return;
    instrument.start({
      note: note,
      velocity: 100,
      detune: 0,
      // time: instrument.context.currentTime,
      // duration: 0.1,
    });
  };

  // Calculate positions for white keys
  const totalWhiteKeys = whiteNotes.length;
  const spacing = 100 / totalWhiteKeys;

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {!isReady && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            padding: "1rem",
            background: "#333",
            color: "white",
            textAlign: "center",
            zIndex: 1000,
          }}
        >
          <button
            onClick={setup}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "1rem",
            }}
          >
            Click to Enable Audio
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
