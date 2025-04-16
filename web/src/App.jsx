import { Canvas } from "@react-three/fiber";
import "./App.css";
import { useState, useRef, useEffect } from "react";
import { whiteNotes, blackNotes, colors, keyMap } from "./constants";
import XylophoneKey from "./XylophoneKey";
import { getAudioContext } from "./util";
import { Mallet, Reverb } from "smplr";
import { Physics, useBox, usePlane } from "@react-three/cannon";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

// Update colors to be brighter
const brighterColors = [
  "#00FFFF", // cyan
  "#0000FF", // blue
  "#FF1493", // dark pink
  "#FF0000", // red
  "#FFA500", // orange
  "#FFFF00", // yellow
  "#00FF00", // green
];

const Background = () => {
  return (
    <mesh>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial color="#cecece" />
    </mesh>
  );
};

// Ground plane component
const Ground = () => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -10, 0],
  }));
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#666666" />
    </mesh>
  );
};

// New component for launching cubes
const LaunchingCube = ({ position, color }) => {
  const [ref, api] = useBox(() => ({
    mass: 1,
    position,
    args: [2, 2, 2], // Back to 2x2 cubes
  }));

  useEffect(() => {
    // Apply an upward and slightly inward force
    const xForce = -position[0] * 0.1; // Force toward center
    api.applyImpulse([xForce, 20, 0], [0, 0, 0]);
  }, []);

  return (
    <mesh ref={ref} castShadow>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
};

const Xylophone = ({ onPlayNote }) => {
  const [instrument, setInstrument] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const reverb = useRef(null);
  const [keyPositions, setKeyPositions] = useState({});

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

  const playNote = (note, position, color) => {
    if (!instrument) return;
    instrument.start({
      note: note,
      velocity: 100,
      detune: 0,
    });
    onPlayNote(note, position, color);
  };

  // Add keyboard event handling
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (keyMap[event.code]) {
        const note = keyMap[event.code];
        const position = keyPositions[note];
        const colorIndex = (note - 55) % 7;
        playNote(note, position, brighterColors[colorIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [instrument, keyPositions]);

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
              color={brighterColors[colorIndex]}
              note={note}
              midiNote={midi}
              onPlay={(note) => {
                const position = [(left - 50) * 0.2, 5, 0];
                setKeyPositions(prev => ({ ...prev, [note]: position }));
                playNote(note, position, brighterColors[colorIndex]);
              }}
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
              onPlay={(note) => {
                const position = [(left - 50) * 0.2, 5, 0];
                setKeyPositions(prev => ({ ...prev, [note]: position }));
                playNote(note, position, "#333333");
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

function App() {
  const [cubes, setCubes] = useState([]);

  const handlePlayNote = (note, position, color) => {
    const newCube = {
      id: Date.now(),
      position: [position[0], position[1], position[2]],
      color: color,
    };
    setCubes((prev) => [...prev, newCube]);
  };

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
        camera={{ position: [0, 15, 30], fov: 50 }}
        shadows
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "50%", // Only use top half of screen
        }}
      >
        <color attach="background" args={['#f0f0f0']} />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <Physics gravity={[0, -9.81, 0]}>
          <Background />
          <Ground />
          {cubes.map((cube) => (
            <LaunchingCube
              key={cube.id}
              position={cube.position}
              color={cube.color}
            />
          ))}
        </Physics>
        <EffectComposer>
          <Bloom
            intensity={1.0}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>
      </Canvas>
      <Xylophone onPlayNote={handlePlayNote} />
    </div>
  );
}

export default App;
