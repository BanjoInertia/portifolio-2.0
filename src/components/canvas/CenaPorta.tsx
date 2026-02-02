import * as THREE from 'three'
import { useRef, useState } from 'react'
import { useGLTF, useCursor } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import type { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    porta_1: THREE.Mesh; porta_2: THREE.Mesh; porta_3: THREE.Mesh; 
    porta_4: THREE.Mesh; porta_5: THREE.Mesh; porta_6: THREE.Mesh;
    parede: THREE.Mesh; parede_1: THREE.Mesh; parede_2: THREE.Mesh; 
    parede_3: THREE.Mesh; parede_4: THREE.Mesh; parede_5: THREE.Mesh; parede_6: THREE.Mesh;
    lampiao: THREE.Mesh; luz_lampiao: THREE.Mesh;
  }
  materials: {
    metal: THREE.MeshStandardMaterial; madeira1: THREE.MeshStandardMaterial;
    metal2: THREE.MeshStandardMaterial; preto: THREE.MeshStandardMaterial;
    vidro: THREE.MeshStandardMaterial; madeira2: THREE.MeshStandardMaterial;
    canos: THREE.MeshStandardMaterial; Material: THREE.MeshStandardMaterial;
    lampiao: THREE.MeshStandardMaterial; ['lampiao-vidro']: THREE.MeshStandardMaterial;
  }
}

type AnimationState = 'idle' | 'recuando' | 'entrando'

export function CenaPorta({ onEnter }: { onEnter: (s: boolean) => void }) {
  const { nodes, materials } = useGLTF('/models/porta.glb') as GLTFResult
  const doorGroupRef = useRef<THREE.Group>(null)
  const cameraTarget = useRef(new THREE.Vector3(0, 5, 0))
  
  const [animState, setAnimState] = useState<AnimationState>('idle')
  const [hovered, setHover] = useState(false)

  useCursor(hovered && animState === 'idle')

  const handleClick = () => {
    if (animState !== 'idle') return
    setAnimState('recuando')
  }

  useFrame((state, delta) => {
    const targetRotation = animState !== 'idle' ? -1.6 : (hovered ? -0.5 : 0)
    
    if (doorGroupRef.current) {
      easing.dampE(doorGroupRef.current.rotation, [0, targetRotation, 0], 0.25, delta)
    }

    let targetPosition = new THREE.Vector3(0, 5, 50) 
    let targetLookAt = new THREE.Vector3(0, 5, 0)
    let smoothTime = 0.6 

    if (animState === 'recuando') {
      targetPosition = new THREE.Vector3(0, 5, 60) 
      targetLookAt = new THREE.Vector3(0, 5, 0)
      smoothTime = 0.8 

      if (state.camera.position.z > 52) {
        setAnimState('entrando')
      }
    } 
    else if (animState === 'entrando') {
      targetPosition = new THREE.Vector3(0, 6, 0)
      targetLookAt = new THREE.Vector3(0, 6, -20)
      smoothTime = 1.6 
    }

    easing.damp3(state.camera.position, targetPosition, smoothTime, delta)
    easing.damp3(cameraTarget.current, targetLookAt, smoothTime, delta)
    state.camera.lookAt(cameraTarget.current)

    if (animState === 'entrando' && state.camera.position.z < 1.5) {
      onEnter(true)
    }
  })

  return (
    <group dispose={null}>

      <group 
        ref={doorGroupRef} 
        position={[-2.919, 3.18, 0.381]}
        onClick={(e) => { e.stopPropagation(); handleClick() }}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true) }} 
        onPointerOut={() => setHover(false)}
      >
        <group position={[0.385, -2.403, 0.101]} scale={0.184}>
          <mesh castShadow receiveShadow geometry={nodes.porta_1.geometry} material={materials.metal} />
          <mesh castShadow receiveShadow geometry={nodes.porta_2.geometry} material={materials.madeira1} />
          <mesh castShadow receiveShadow geometry={nodes.porta_3.geometry} material={materials.metal2} />
          <mesh castShadow receiveShadow geometry={nodes.porta_4.geometry} material={materials.preto} />
          <mesh castShadow receiveShadow geometry={nodes.porta_5.geometry} material={materials.vidro} />
          <mesh castShadow receiveShadow geometry={nodes.porta_6.geometry} material={materials.madeira2} />
        </group>
      </group>

      <group position={[0, 3.854, -0.021]} rotation={[Math.PI / 2, 0, 0]} scale={[39.038, 25.313, 25.313]}>
        <mesh castShadow receiveShadow geometry={nodes.parede.geometry} material={materials.madeira2} />
        <mesh castShadow receiveShadow geometry={nodes.parede_1.geometry} material={materials.preto} />
        <mesh castShadow receiveShadow geometry={nodes.parede_2.geometry} material={materials.madeira1} />
        <mesh castShadow receiveShadow geometry={nodes.parede_3.geometry} material={materials.metal} />
        <mesh castShadow receiveShadow geometry={nodes.parede_4.geometry} material={materials.metal2} />
        <mesh castShadow receiveShadow geometry={nodes.parede_5.geometry} material={materials.canos} />

        <mesh geometry={nodes.parede_6.geometry}>
           <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={5} toneMapped={false} />
        </mesh>
      </group>

      <mesh castShadow receiveShadow geometry={nodes.lampiao.geometry} material={materials.lampiao} position={[-5.608, 6.091, 2.237]} scale={0.646} />

      <mesh geometry={nodes.luz_lampiao.geometry} position={[-5.608, 7.312, 2.237]} scale={0.576}>
        <meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={3} toneMapped={false} />
      </mesh>

      <pointLight 
        position={[-5, 7.3, 15]} 
        intensity={700} 
        distance={50} 
        color="#ffaa00" 
        castShadow 
        shadow-bias={-0.0005} 
        shadow-mapSize={[2048, 2048]} 
      />
    </group>
  )
}

useGLTF.preload('/models/porta.glb')