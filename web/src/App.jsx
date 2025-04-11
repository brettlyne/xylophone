import { Canvas, OrthographicCamera } from '@react-three/fiber'
import './App.css'

const XylophoneKey = ({ position, color, note, isBlackKey = false }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={[isBlackKey ? 0.6 : 1, isBlackKey ? 3 : 4, 0.5]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

const Xylophone = () => {
  const whiteNotes = ['G', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'A', 'B', 'C', 'D', 'E', 'F', 'G']
  const blackNotes = ['G#', 'A#', null, 'C#', 'D#', null, 'F#', 'G#', 'A#', null, 'C#', 'D#', null, 'F#']
  const colors = [
    '#00FFFF', // cyan
    '#0000FF', // blue
    '#FF1493', // dark pink
    '#FF0000', // red
    '#FFA500', // orange
    '#FFFF00', // yellow
    '#00FF00', // green
  ]

  const keySpacing = 1.2

  return (
    <>
      {/* White keys */}
      {whiteNotes.map((note, index) => {
        const colorIndex = index % 7
        const xPosition = (index - 7) * keySpacing
        return (
          <XylophoneKey
            key={`white-${index}`}
            position={[xPosition, 0, 0]}
            color={colors[colorIndex]}
            note={note}
          />
        )
      })}
      
      {/* Black keys */}
      {blackNotes.map((note, index) => {
        if (!note) return null
        const xPosition = (index - 6.5) * keySpacing
        return (
          <XylophoneKey
            key={`black-${index}`}
            position={[xPosition, 0.5, 0.25]}
            color="#333333"
            note={note}
            isBlackKey={true}
          />
        )
      })}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
    </>
  )
}

function App() {
  return (
    <div className="App" style={{ width: '100vw', height: '100vh' }}>
      <Canvas>
        <OrthographicCamera
          makeDefault
          position={[0, 0, 10]}
          zoom={50}
          near={0.1}
          far={1000}
        />
        <Xylophone />
      </Canvas>
    </div>
  )
}

export default App
