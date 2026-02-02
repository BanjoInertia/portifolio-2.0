import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { CenaPorta } from './components/canvas/CenaPorta'
import { CenaCabine } from './components/canvas/CenaCabine'

export default function App() {
  const [currentScene, setCurrentScene] = useState<'porta' | 'cabine'>('porta')
  const [fadeToBlack, setFadeToBlack] = useState(false)
  const [showText, setShowText] = useState(false)

  useEffect(() => {
    if (fadeToBlack && currentScene === 'porta') {
      
      const timerTexto = setTimeout(() => {
        setShowText(true)
      }, 1500)

      const timerTrocaCena = setTimeout(() => {
        setShowText(false)
        setCurrentScene('cabine')
      }, 4500)

      return () => { clearTimeout(timerTexto); clearTimeout(timerTrocaCena) }
    }

    if (currentScene === 'cabine') {
      const timerRevelar = setTimeout(() => {
        setFadeToBlack(false)
      }, 100)
      return () => clearTimeout(timerRevelar)
    }

  }, [fadeToBlack, currentScene])

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', backgroundColor: '#101010' }}>
      
      <Canvas shadows camera={{ position: [0, 5, 50], fov: 10 }}>
        <ambientLight intensity={0.05} />

        {currentScene === 'porta' ? (
          <CenaPorta onEnter={setFadeToBlack} />
        ) : (
          <CenaCabine />
        )}
      </Canvas>

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'black',
          pointerEvents: 'none',
          opacity: fadeToBlack ? 1 : 0,
          transition: 'opacity 1.5s ease-in-out',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <h1 
          style={{ 
            color: 'white', 
            fontFamily: 'sans-serif',
            opacity: showText ? 1 : 0,
            transition: 'opacity 1s ease-in-out'
          }}
        >
          Mensagem Humilde
        </h1>
      </div>
    </div>
  )
}