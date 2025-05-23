import { Canvas } from "@react-three/fiber";
import "./App.css";
import { useState, useRef, useEffect } from "react";
import { whiteNotes, blackNotes, keyMap, noteLookup, colors, drumKeyMap, symbolMap } from "./constants";
import XylophoneKey from "./XylophoneKey";
import { getAudioContext } from "./util";
import { Mallet, Reverb, DrumMachine } from "smplr";
import { Physics, useBox, usePlane } from "@react-three/cannon";
import { EffectComposer, Bloom, Pixelation } from "@react-three/postprocessing";
import gsap from "gsap";

const GroundPlane = ({ shake }) => {
  const [ref, api] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -10, 0],
  }));

  useEffect(() => {
    if (shake) {
      // Store original position
      const originalPosition = [0, -10, 0];
      
      // Create a timeline for the animation
      const tl = gsap.timeline();
      
      // First frame: instantly move up
      api.position.set(0, -9.5, 0);
      
      // Animate back down
      tl.to({}, {
        duration: 0.2,
        ease: "power2.out",
        onUpdate: () => {
          const progress = tl.progress();
          const currentY = -9.5 + (progress * -0.5); // Interpolate from -9.5 to -10
          api.position.set(0, currentY, 0);
        },
        onComplete: () => {
          api.position.set(...originalPosition);
        }
      });
    }
  }, [shake, api]);

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#666666" />
    </mesh>
  );
};

const LaunchingCube = ({ position, color, isBlackKey }) => {
  const [ref, api] = useBox(() => ({
    mass: 1,
    position,
    args: isBlackKey ? [1, 1, 1] : [2, 2, 2],
  }));

  useEffect(() => {
    // Apply an upward and slightly inward force
    const xForce = -position[0] * 0.1; // Force toward center
    api.applyImpulse([xForce, 18, -5], [0, 0, 0]);
  }, [api, position]);

  return (
    <mesh ref={ref} castShadow>
      {isBlackKey ? (
        <sphereGeometry args={[1, 16, 16]} />
      ) : (
        <boxGeometry args={[2, 2, 2]} />
      )}
      <meshStandardMaterial 
        color={color} 
        emissive={color}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
};

const Xylophone = ({ onPlayNote, setShake }) => {
  const [instrument, setInstrument] = useState(null);
  const [drumMachine, setDrumMachine] = useState(null);
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

    const newDrumMachine = new DrumMachine(context, {
      instrument: "TR-808",
      volume: 100,
    });
    // newDrumMachine.output.addEffect("reverb", reverb.current, 0.25);
    setDrumMachine(newDrumMachine);

    newDrumMachine.load.then(() => {
      console.log("drums loaded");
    });
    newPiano.load.then(() => {
      console.log("loaded");
      setIsReady(true);
    });
  };

  const playNote = (midiNote) => {
    if (!instrument) return;
    const noteData = noteLookup[midiNote];
    if (!noteData) return;

    instrument.start({
      note: midiNote,
      velocity: 100,
      detune: 0,
    });
    setKeyPositions(prev => ({ ...prev, [midiNote]: noteData.position }));
    onPlayNote(midiNote, noteData.position, noteData.color, noteData.isBlackKey);

    // Animate the key
    const keyElement = document.querySelector(`.midi-${midiNote}`);
    if (keyElement) {
      gsap.killTweensOf(keyElement);
      
      gsap.fromTo(keyElement, 
        { scale: 1.05 },
        { 
          scale: 1.0,
          duration: 0.35,
          ease: "power2.out"
        }
      );
    }
  };

  // Add keyboard event handling
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check for drum sounds first
      if (drumMachine && drumKeyMap[event.code]) {
        event.preventDefault();
        drumMachine.start({ note: drumKeyMap[event.code] });
        setShake(true);
        setTimeout(() => setShake(false), 100);
        return;
      }
      
      // Then check for piano sounds
      if (keyMap[event.code]) {
        event.preventDefault();
        playNote(keyMap[event.code]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [instrument, drumMachine, setShake]);

  // Calculate positions for white keys
  const totalWhiteKeys = whiteNotes.length;
  const spacing = 100 / totalWhiteKeys;

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>

      
      {/* Just used to explore the drum machine options */}
      {/* {drumMachine && (
        drumMachine?.getGroupNames().map((group) => (
          <div>
            <h2>{group}</h2>
            {drumMachine?.getSampleNamesForGroup(group).map((sample) => (
              <button onClick={() => {
                drumMachine.start({note: sample})
                console.log(sample)
              }}>{sample}</button>
            ))}
          </div>
        ))
      )} */}

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
          const left = spacing * index + spacing / 2;
          return (
            <XylophoneKey
              key={`white-${index}`}
              left={left}
              color={colors[index % 7]}
              note={note}
              midiNote={midi}
              onPlay={() => playNote(midi)}
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
              onPlay={() => playNote(midi)}
            />
          );
        })}
      </div>
    </div>
  );
};

function App() {
  const [cubes, setCubes] = useState([]);
  const [shake, setShake] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pixelation, setPixelation] = useState(8);

  const handlePlayNote = (note, position, color, isBlackKey) => {
    const newCube = {
      id: Date.now(),
      position: [position[0], position[1], position[2]],
      color: color,
      isBlackKey: isBlackKey
    };
    setCubes((prev) => [...prev, newCube]);
  };

  const clearCubes = () => {
    setCubes([]);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const togglePixelation = () => {
    const values = [0, 4, 8, 16];
    const currentIndex = values.indexOf(pixelation);
    const nextIndex = (currentIndex + 1) % values.length;
    setPixelation(values[nextIndex]);
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
      <div
        className="controls-panel"
        style={{ opacity: showControls ? 1 : 0 }}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <div className="controls-buttons">
          <button
            onClick={clearCubes}
            className="control-button"
          >
            Clear Cubes
          </button>
          <button
            onClick={togglePause}
            className={`control-button ${isPaused ? 'paused' : ''}`}
          >
            {isPaused ? "Resume" : "Pause"}
          </button>
          <button
            onClick={toggleFullscreen}
            className="control-button"
          >
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </button>
          <button
            onClick={togglePixelation}
            className="control-button"
          >
            Pixelation: {pixelation}
          </button>
        </div>
      </div>
      <Canvas
        camera={{ position: [0, 15, 30], fov: 50, far: 1000 }}
        shadows
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "70%",
        }}
      >
        <color attach="background" args={['#1a1a1a']} />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[20, 20, 10]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
          shadow-camera-near={0.1}
          shadow-camera-far={200}
        />
        <Physics gravity={[0, -9.81, 0]} isPaused={isPaused}>
          <GroundPlane shake={shake} />
          {cubes.map((cube) => (
            <LaunchingCube
              key={cube.id}
              position={cube.position}
              color={cube.color}
              isBlackKey={cube.isBlackKey}
            />
          ))}
        </Physics>
        <EffectComposer>
          <Bloom
            intensity={1.0}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
          />
          <Pixelation
            granularity={pixelation}
          />
        </EffectComposer>
      </Canvas>
      <Xylophone onPlayNote={handlePlayNote} setShake={setShake} />
    </div>
  );
}

export default App;
