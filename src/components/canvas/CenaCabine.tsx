import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { useGLTF, useCursor, Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import type { GLTF } from 'three-stdlib'
import portfolioData from '../../assets/portfolio.json'

type GLTFResult = GLTF & {
  nodes: {
    [key: string]: THREE.Mesh
  }
  materials: {
    [key: string]: THREE.MeshStandardMaterial
  }
}

function BlinkingLight({ node, color, speed, offset }: { node: THREE.Mesh, color: string, speed: number, offset: number }) {
  if (!node) return null

  const material = (node.material as THREE.MeshStandardMaterial).clone()
  const materialRef = useRef(material)
  const lightRef = useRef<THREE.PointLight>(null)

  useFrame((state) => {
    const time = state.clock.elapsedTime
    const wave = Math.sin(time * speed + offset)
    const intensity = Math.max(0, wave)

    if (materialRef.current) {
      materialRef.current.emissive = new THREE.Color(color)
      materialRef.current.emissiveIntensity = intensity * 5
    }
    if (lightRef.current) {
      lightRef.current.intensity = intensity * 4
    }
  })

  return (
    <group>
      <mesh geometry={node.geometry} material={materialRef.current} position={node.position} rotation={node.rotation} scale={node.scale} />
      <pointLight ref={lightRef} position={node.position} distance={3} color={color} decay={2} />
    </group>
  )
}

export function CenaCabine() {
  const { nodes, materials } = useGLTF('/models/cabine.glb') as any

  console.log("Nodes disponíveis:", Object.keys(nodes));

  const livro1Ref = useRef<THREE.Group>(null)
  const livro2CapaRef = useRef<THREE.Group>(null)
  const fita1Ref = useRef<THREE.Group>(null)
  const fita2Ref = useRef<THREE.Group>(null)
  const artefatoRef = useRef<THREE.Group>(null)
  const medidor1Ref = useRef<THREE.Mesh>(null)
  const medidor2Ref = useRef<THREE.Mesh>(null)
  const globoRef = useRef<THREE.Group>(null)
  const alavanca1Ref = useRef<THREE.Group>(null)
  const alavanca2Ref = useRef<THREE.Group>(null)
  const setaDirRef = useRef<THREE.Group>(null)
  const setaEsqRef = useRef<THREE.Group>(null)
  const telaPrincipalRef = useRef<THREE.Mesh>(null)

  const testeRef = useRef<THREE.Mesh>(null)

  const [livro1Aberto, setLivro1Aberto] = useState(false)
  const [livro2Aberto, setLivro2Aberto] = useState(false)
  const [globoGirando, setGloboGirando] = useState(false)
  const [alavanca1Ativa, setAlavanca1Ativa] = useState(false)
  const [alavanca2Ativa, setAlavanca2Ativa] = useState(false)
  const [setaDirAtiva, setSetaDirAtiva] = useState(false)
  const [setaEsqAtiva, setSetaEsqAtiva] = useState(false)

  const [showModal, setShowModal] = useState(false)
  const [btnHovered, setBtnHovered] = useState(false)
  const [hovered, setHover] = useState(false)

  const [pagina, setPagina] = useState(0)

  useCursor(hovered)

  const totalPaginas = portfolioData.length + 1

  const proximaPagina = () => setPagina((prev) => (prev + 1) % totalPaginas)
  const paginaAnterior = () => setPagina((prev) => (prev - 1 + totalPaginas) % totalPaginas)

  useEffect(() => {
    setShowModal(false);

    const timer = setTimeout(() => {
      setShowModal(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // --- ANIMAÇÃO ---
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const fitaTarget = livro2Aberto ? -1.6 : 0
    const fitaFilhaTarget = livro2Aberto ? -1.2 : 0
    const capaTarget = livro2Aberto ? 2.2 : 0

    state.camera.position.x = Math.sin(t * 0.1) * 0.5
    state.camera.position.y = 1.8 + Math.sin(t * 0.5) * 0.1
    state.camera.position.z = 45
    state.camera.lookAt(0, 5, 0)

    if (livro1Ref.current) {
      const target = livro1Aberto ? 3 : 0
      easing.dampE(livro1Ref.current.rotation, [0, 0, target], 0.25, delta)
    }

    if (fita1Ref.current) {
      easing.dampE(fita1Ref.current.rotation, [0, 0, fitaTarget], 0.2, delta)
    }

    if (fita2Ref.current) {
      easing.dampE(fita2Ref.current.rotation, [0, 0, fitaFilhaTarget], 0.3, delta)
    }

    if (livro2CapaRef.current) {
      const podeAbrirCapa = Math.abs(fita1Ref.current?.rotation.z || 0) > 0.4
      const currentTargetCapa = livro2Aberto ? (podeAbrirCapa ? capaTarget : 0) : 0

      easing.dampE(livro2CapaRef.current.rotation, [0, 0, currentTargetCapa], 0.25, delta)
    }

    if (artefatoRef.current) {
      const oscilacao = Math.sin(t * 2) * 1.2;
      artefatoRef.current.rotation.z = oscilacao;
    }

    if (medidor1Ref.current) {
      const tremor1 = Math.sin(t * 2) * 1 + (Math.random() * 0.02)
      medidor1Ref.current.rotation.z = tremor1
    }

    if (medidor2Ref.current) {
      const tremor2 = Math.cos(t * 2) * 1.8
      medidor2Ref.current.rotation.z = tremor2
    }

    if (globoRef.current && globoGirando) {
      globoRef.current.rotation.y += delta * 2.0;
    }

    if (alavanca1Ref.current) {
      const target1 = alavanca1Ativa ? 0.4 : 0;
      easing.dampE(alavanca1Ref.current.rotation, [target1, 0, 0], 0.2, delta);
    }

    if (alavanca2Ref.current) {
      const target2 = alavanca2Ativa ? 0.4 : 0;
      easing.dampE(alavanca2Ref.current.rotation, [target2, 0, 0], 0.2, delta);
    }

    if (testeRef.current) {
      testeRef.current.position.x = -0.122 + Math.sin(t * 0.7) * 0.03
      testeRef.current.position.y = 6.137 + Math.cos(t * 0.6) * 0.02

      testeRef.current.rotation.z = Math.sin(t * 0.2) * 0.005
    }

    if (setaDirRef.current) {
      const press = setaDirAtiva ? -0.15 : 0
      easing.damp3(setaDirRef.current.position, [0, 0, press], 0.1, delta)
    }

    if (setaEsqRef.current) {
      const press = setaEsqAtiva ? -0.15 : 0
      easing.damp3(setaEsqRef.current.position, [0, 0, press], 0.1, delta)
    }

    if (telaPrincipalRef.current) {
      const material = telaPrincipalRef.current.material as THREE.MeshStandardMaterial

      const targetIntensity = showModal ? 0.8 : 0
      const targetColor = showModal ? new THREE.Color("#00aaff") : new THREE.Color("#000510")

      easing.damp(material, 'emissiveIntensity', targetIntensity, 0.5, delta)
      easing.dampC(material.emissive, targetColor, 0.5, delta)
    }
  })

  const handleOver = (e: any) => { e.stopPropagation(); setHover(true) }
  const handleOut = () => setHover(false)

  if (!nodes) return null

  return (
    <>
      <group dispose={null}>

        {/* ================= MODAL CENTRAL ================= */}
        <group position={[0, 6.5, -2]}>
          <Html center distanceFactor={12}>
            <div style={{
              ...panelStyle,
              opacity: showModal ? 1 : 0,
              transform: showModal ? 'scale(1)' : 'scale(0.98)',
              transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
              pointerEvents: showModal ? 'all' : 'none'
            }}>
              {pagina === 0 ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#00ffa3', marginBottom: '10px' }}>
                    <span>SISTEMA: ONLINE</span>
                    <span>v1.0.4</span>
                  </div>

                  <h2 style={titleStyle}>BEM-VINDO, OPERADOR</h2>
                  <div style={dividerStyle} />

                  <p style={descStyle}>
                    ESTE TERMINAL EXIBE O PORTFÓLIO TÉCNICO.
                    USE AS SETAS LATERAIS NO PAINEL 3D PARA NAVEGAR PELOS ARQUIVOS.
                  </p>

                  <div style={{ marginTop: '15px' }}>
                    <span style={{ fontSize: '11px', color: '#00ffa3' }}>TECH_STACK:</span>
                    <div style={{ fontSize: '12px', color: '#aaffff', marginTop: '5px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                      <span>{">"} REACT / REACT NATIVE</span>
                      <span>{">"} TYPESCRIPT</span>
                      <span>{">"} THREE.JS / R3F</span>
                      <span>{">"} STYLED COMPONENTS</span>
                    </div>
                  </div>

                  <a
                    href="https://github.com/BanjoInertia"
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => setBtnHovered(true)}
                    onMouseLeave={() => setBtnHovered(false)}
                    style={{
                      ...actionButtonStyle,
                      background: btnHovered ? '#00ffa3' : 'transparent',
                      color: btnHovered ? '#001414' : '#00ffa3',
                    }}
                  >
                    ACESSAR_GITHUB
                  </a>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#00ffa3', marginBottom: '10px' }}>
                    <span>ID_{portfolioData[pagina - 1].id}</span>
                    <span>STATUS: {portfolioData[pagina - 1].status}</span>
                  </div>

                  <h2 style={titleStyle}>{portfolioData[pagina - 1].titulo}</h2>
                  <div style={dividerStyle} />

                  <p style={descStyle}>{portfolioData[pagina - 1].descricao}</p>

                  <div style={{ fontSize: '11px', color: '#00aaff', marginTop: '10px', textAlign: 'left', marginBottom: '20px' }}>
                    {portfolioData[pagina - 1].detalhes}
                  </div>

                  <a
                    href={portfolioData[pagina - 1].link}
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => setBtnHovered(true)}
                    onMouseLeave={() => setBtnHovered(false)}
                    style={{
                      ...actionButtonStyle,
                      background: btnHovered ? '#00ffa3' : 'transparent',
                      color: btnHovered ? '#001414' : '#00ffa3',
                    }}
                  >
                    ABRIR_PROJETO
                  </a>
                </>
              )}

              <div style={cornerStyle} />
            </div>
          </Html>
        </group>


        {nodes.teste && (
          <mesh
            ref={testeRef}
            geometry={nodes.teste.geometry}
            position={[-0.122, 6.137, -5.516]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={13.539}
          >
            <meshStandardMaterial
              map={materials.teste.map}
              emissiveMap={materials.teste.map}
              emissive={new THREE.Color(0xffffff)}
              emissiveIntensity={1.2}
              toneMapped={false}
            />
          </mesh>
        )}
        {/* ================= LIVRO 1 ================= */}
        <group
          position={[-5.841, 2.311, 2.844]}
          rotation={[0.5, 0.762, -0.224]}
          scale={0.708}
        >

          <primitive
            object={nodes.Empty_Livro1_Pivo}
            ref={livro1Ref}
            position={[0, 0, 0]}
            scale={[1, 1, 1]}
            onClick={(e: any) => {
              e.stopPropagation();
              setLivro1Aberto(!livro1Aberto);
            }}
            onPointerOver={handleOver}
            onPointerOut={handleOut}
          />
        </group>

        <group position={[-5.386, 2.526, 2.479]} rotation={[1.915, -0.161, -0.775]} scale={0.708}>
          <mesh geometry={nodes.livro_1_1.geometry} material={materials.cobre} />
          <mesh geometry={nodes.livro_1_2.geometry} material={materials['cobre.001']} />
          <mesh geometry={nodes.livro_1_3.geometry} material={materials.bege} />
          <mesh geometry={nodes.livro_1_4.geometry} material={materials.amarelo} />
        </group>

        {/* ================= LIVRO 2 ================= */}

        <group position={[5.464, 2.152, 3.052]} rotation={[0.466, -0.729, 0.194]} scale={0.638}>
          <primitive
            object={nodes.Empty_livro_2_Pivo}
            ref={livro2CapaRef}
            position={[0, 0, 0]}
            scale={[1, 1, 1]}
            onClick={(e: any) => { e.stopPropagation(); setLivro2Aberto(!livro2Aberto) }}
            onPointerOver={handleOver}
            onPointerOut={handleOut}
          />
        </group>

        <group position={[6.452, 1.652, 3.788]} rotation={[0.466, -0.729, 0.194]} scale={0.638}>

          <primitive
            object={nodes.Empty_livro_2_fita_1_Pivo}
            ref={fita1Ref}
            position={[0, 0, 0]}
            scale={[1, 1, 1]}
          >
            <primitive
              object={nodes.Empty_livro_2_fita_2_Pivo}
              ref={fita2Ref}
              scale={[1, 1, 1]}
            />
          </primitive>
        </group>

        <group position={[5.961, 2.111, 3.521]} rotation={[0.466, -0.729, 0.194]} scale={0.148}>
          <mesh geometry={nodes.livro_2_1.geometry} material={materials.cobre} />
          <mesh geometry={nodes.livro_2_2.geometry} material={materials['cobre.001']} />
          <mesh geometry={nodes.livro_2_3.geometry} material={materials.bege} />
          <mesh geometry={nodes.livro_2_4.geometry} material={materials.amarelo} />
        </group>

        {/* ================= ARTEFATO ================= */}
        <group
          position={[4.098, 3.75, -1.284]}
          rotation={[-0.024, -0.56, -0.885]}
          scale={0.587}
        >
          {nodes.artefato_dourado_ponteiro_1 && (
            <primitive
              object={nodes.Empty_artefato_dourado_ponteiro_Pivo || new THREE.Group()}
              ref={artefatoRef}
              position={[0.1, 0.1, 0.3]}
              scale={[0.1, 0.1, 0.1]}
            >
              <mesh
                geometry={nodes.artefato_dourado_ponteiro_1.geometry}
                material={materials.ouro}
              />
              <mesh
                geometry={nodes.artefato_dourado_ponteiro_2.geometry}
                material={materials.preto}
              />
            </primitive>
          )}
        </group>

        <group position={[4.098, 3.75, -1.284]} rotation={[1.622, -0.119, 0.564]} scale={[0.522, 0.058, 0.522]}>
          <mesh geometry={nodes.artefato_dourado_1.geometry} material={materials.ouro} />
          <mesh geometry={nodes.artefato_dourado_2.geometry} material={materials.madeira} />
        </group>

        {/* ================= ALAVANCA 1 (Esquerda) ================= */}
        <group position={[-4.17, 2.582, 0.483]} rotation={[0.343, 0.637, -0.07]}>
          {nodes.Empty_alavanca_1 && (
            <primitive
              object={nodes.Empty_alavanca_1}
              ref={alavanca1Ref}
              position={[0, 0, 0]}
              scale={[1, 1, 1]}
              onClick={(e: any) => {
                e.stopPropagation();
                setAlavanca1Ativa(!alavanca1Ativa);
              }}
              onPointerOver={handleOver}
              onPointerOut={handleOut}
            />
          )}
        </group>

        {/* ================= ALAVANCA 2 (Direita) ================= */}
        <group position={[-3.559, 2.683, 0.039]} rotation={[0.343, 0.637, -0.07]}>
          {nodes.Empty_alavanca_2 && (
            <primitive
              object={nodes.Empty_alavanca_2}
              ref={alavanca2Ref}
              position={[0, 0, 0]}
              scale={[1, 1, 1]}
              onClick={(e: any) => {
                e.stopPropagation();
                setAlavanca2Ativa(!alavanca2Ativa);
              }}
              onPointerOver={handleOver}
              onPointerOut={handleOut}
            />
          )}
        </group>

        {/* ================= SETA DIREITA ================= */}
        <group
          position={[2.2, 2.992, -0.32]}
          rotation={[-0.671, -0.171, -0.153]}
        >
          <group ref={setaDirRef}>
            <group
              position={[0.007, -0.008, -0.385]}
              rotation={[-1.535, 1.556, 3.105]}
              scale={0.384}
              onClick={(e: any) => {
                e.stopPropagation()
                setSetaDirAtiva(true)
                proximaPagina()
                setTimeout(() => setSetaDirAtiva(false), 150)
              }}
              onPointerOver={handleOver}
              onPointerOut={handleOut}
            >
              <mesh geometry={nodes.seta_direita_1.geometry} material={materials.cobre} />
              <mesh geometry={nodes.seta_direita_2.geometry} material={materials.preto} />
            </group>
          </group>
        </group>

        {/* ================= SETA ESQUERDA ================= */}
        <group
          position={[-2.196, 2.988, -0.317]}
          rotation={[-0.673, 0.17, 0.14]}
        >
          <group ref={setaEsqRef}>
            <group
              position={[-0.011, -0.001, -0.386]}
              rotation={[0.679, 1.131, 0.893]}
              scale={0.384}
              onClick={(e: any) => {
                e.stopPropagation()
                setSetaEsqAtiva(true)
                paginaAnterior()
                setTimeout(() => setSetaEsqAtiva(false), 150)
              }}
              onPointerOver={handleOver}
              onPointerOut={handleOut}
            >
              <mesh geometry={nodes.seta_esquerda_1.geometry} material={materials.cobre} />
              <mesh geometry={nodes.seta_esquerda_2.geometry} material={materials.preto} />
            </group>
          </group>
        </group>

        {/* ================= MEDIDOR 1 ================= */}
        <group position={[-4.514, 4.034, -1.34]} rotation={[-0.108, 0.656, -0.5]}>
          <primitive
            object={nodes.Empty_medidor_1_Pivo || new THREE.Group()}
            ref={medidor1Ref}
            position={[0, 0, 0]}
            scale={[1, 1, 1]}
            rotation={[0, 0, 0]}
          >
            <mesh
              geometry={nodes.medidores002?.geometry}
              material={materials.preto}
              position={[0, 0.011, -0.122]}
              rotation={[0.093, 0.042, 0.753]}
              scale={0.103}
            />
          </primitive>
        </group>

        {/* ================= MEDIDOR 2 ================= */}
        <group position={[-6.055, 3.803, -0.044]} rotation={[-0.112, 0.695, -0.5]}>
          <primitive
            object={nodes.Empty_medidor_2_Pivo || new THREE.Group()}
            ref={medidor2Ref}
            position={[0, 0, 0]}
            scale={[1, 1, 1]}
          >
            <mesh
              geometry={nodes.medidores003?.geometry}
              material={materials.preto}
              position={[-0.09, 0.111, -0.091]}
              rotation={[0.087, 0.004, 0.753]}
              scale={0.103}
            />
          </primitive>
        </group>

        <group position={[-5.386, 2.526, 2.479]} rotation={[1.915, -0.161, -0.775]} scale={0.708}>
          <mesh geometry={nodes.livro_1_1?.geometry} material={materials.cobre} />
          <mesh geometry={nodes.livro_1_2?.geometry} material={materials['cobre.001']} />
          <mesh geometry={nodes.livro_1_3?.geometry} material={materials.bege} />
          <mesh geometry={nodes.livro_1_4?.geometry} material={materials.amarelo} />
        </group>
        <group position={[5.961, 2.111, 3.521]} rotation={[0.466, -0.729, 0.194]} scale={0.148}>
          <mesh geometry={nodes.livro_2_1?.geometry} material={materials.cobre} />
          <mesh geometry={nodes.livro_2_2?.geometry} material={materials['cobre.001']} />
          <mesh geometry={nodes.livro_2_3?.geometry} material={materials.bege} />
          <mesh geometry={nodes.livro_2_4?.geometry} material={materials.amarelo} />
        </group>

        <group position={[4.098, 3.75, -1.284]} rotation={[1.622, -0.119, 0.564]} scale={[0.522, 0.058, 0.522]}>
          <mesh geometry={nodes.artefato_dourado_1?.geometry} material={materials.ouro} />
          <mesh geometry={nodes.artefato_dourado_2?.geometry} material={materials.madeira} />
        </group>

        {/* ================= GLOBO (Esfera com Pivô) ================= */}
        <group
          position={[5.417, 3.675, 1.223]}
          rotation={[0.244, 0.205, -0.311]}
          scale={0.58}
        >
          {nodes.globo_esfera_1 && (
            <primitive
              object={nodes.Empty_globo_esfera_Pivo || nodes.globo_esfera_1.parent || new THREE.Group()}
              ref={globoRef}
              position={[0, 0, 0]}
              scale={[1, 1, 1]}
              onClick={(e: any) => {
                e.stopPropagation();
                setGloboGirando(!globoGirando);
              }}
              onPointerOver={handleOver}
              onPointerOut={handleOut}
            >
            </primitive>
          )}
        </group>

        <mesh geometry={nodes.globo_estrutura002?.geometry} material={materials['cobre.001']} position={[5.534, 2.937, 1.011]} rotation={[0.244, 0.205, 0.128]} scale={[0.072, 0.087, 0.072]} />

        <mesh geometry={nodes.esfera_vermelha?.geometry} material={materials.vermelho} position={[3.317, 2.319, 0.869]} rotation={[0.384, -0.445, 0.086]} scale={0.455} />

        <mesh geometry={nodes.telinha?.geometry} position={[-5.244, 3.176, -0.927]} rotation={[0.139, -0.856, 0.208]} scale={[0.195, 0.195, 0.332]}>
          <meshStandardMaterial color="#00ffa3" emissive="#00ffa3" emissiveIntensity={3} toneMapped={false} />
        </mesh>
        <mesh
          ref={telaPrincipalRef}
          geometry={nodes.tela_principal?.geometry}
          position={[0, 3.668, -0.839]}
          rotation={[1.142, 0, 0]}
        >
          <meshStandardMaterial
            color="#000510"
            emissive="#000510"
            emissiveIntensity={0}
            toneMapped={false}
          />
        </mesh>

        <BlinkingLight node={nodes.luz} color="#ff0000" speed={2.5} offset={0} />
        <BlinkingLight node={nodes.luz001} color="#0000ff" speed={5} offset={15} />
        <BlinkingLight node={nodes.luz002} color="#00ff00" speed={3} offset={5} />
        <BlinkingLight node={nodes.luz003} color="#00ff00" speed={4} offset={2} />
        <BlinkingLight node={nodes.luz004} color="#00ff00" speed={5} offset={0} />
        <BlinkingLight node={nodes.luz005} color="#00ff00" speed={7} offset={2} />
        <BlinkingLight node={nodes.luz006} color="#ffff00" speed={3} offset={5} />
        <BlinkingLight node={nodes.luz007} color="#ffff00" speed={4} offset={1} />
        <BlinkingLight node={nodes.luz008} color="#ff0000" speed={2} offset={10} />

        <group position={[-6.249, 3.891, -0.252]} rotation={[1.882, 0.465, -0.789]} scale={0.679}>
          <mesh geometry={nodes.cena_1?.geometry} material={materials.metal} />
          <mesh geometry={nodes.cena_2?.geometry} material={materials.bege} />
          <mesh geometry={nodes.cena_3?.geometry} material={materials.amarelo} />
          <mesh geometry={nodes.cena_4?.geometry} material={materials.vermelho} />
          <mesh geometry={nodes.cena_5?.geometry} material={materials.verde} />
          <mesh geometry={nodes.cena_6?.geometry} material={materials.ciano} />
          <mesh geometry={nodes.cena_7?.geometry} material={materials.cabo_1} />
          <mesh geometry={nodes.cena_8?.geometry} material={materials.preto} />
          <mesh geometry={nodes.cena_9?.geometry} material={materials.madeira} />
          <mesh geometry={nodes.cena_10?.geometry} material={materials.metal_2} />
          <mesh geometry={nodes.cena_11?.geometry} material={materials.cabo_2} />
        </group>

        <mesh geometry={nodes.mesh?.geometry} material={materials.preto} />

        <mesh geometry={nodes.lampiao?.geometry} material={materials.lampiao} position={[-3.987, 6.423, -1.352]} rotation={[0, 0.299, 0]} scale={0.431} />
        <mesh geometry={nodes.luz_lampiao?.geometry} material={materials['lampiao-vidro']} position={[-3.987, 7.238, -1.352]} rotation={[0, 0.299, 0]} scale={0.385}>
          <meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={3} toneMapped={false} />
        </mesh>

        <pointLight position={[-2, 7.2, 4]} intensity={200} distance={50} color="#ffaa00" castShadow shadow-bias={-0.0005} shadow-mapSize={[2048, 2048]} />
        <mesh geometry={nodes.arvores.geometry} material={materials.preto} position={[-15.311, 6.216, -5.168]} rotation={[Math.PI / 2, -1.357, 0]} scale={0.923} />
        <mesh geometry={nodes.arvores001.geometry} material={materials.preto} position={[-18.697, 2.863, -5.168]} rotation={[Math.PI / 2, -1.357, 0]} scale={0.923} />
        <mesh geometry={nodes.arvores002.geometry} material={materials.preto} position={[-16.886, 3.439, -5.168]} rotation={[Math.PI / 2, -1.242, 0]} scale={0.923} />
      </group>
    </>
  )
}

const panelStyle: React.CSSProperties = {
  background: 'rgba(0, 20, 20, 0.7)',
  backdropFilter: 'blur(4px)',
  color: '#e0ffff',
  padding: '25px',
  borderRadius: '2px',
  width: '380px',
  border: '1px solid rgba(0, 255, 163, 0.3)',
  boxShadow: '0 0 20px rgba(0, 255, 163, 0.1), inset 0 0 15px rgba(0, 255, 163, 0.1)',
  fontFamily: '"Courier New", Courier, monospace',
  position: 'relative',
  textTransform: 'uppercase'
}

const titleStyle: React.CSSProperties = {
  margin: '0',
  fontSize: '22px',
  letterSpacing: '2px',
  color: '#00ffa3',
  textShadow: '0 0 10px rgba(0, 255, 163, 0.5)'
}

const dividerStyle: React.CSSProperties = {
  height: '2px',
  background: 'linear-gradient(90deg, #00ffa3, transparent)',
  margin: '10px 0'
}

const descStyle: React.CSSProperties = {
  fontSize: '13px',
  lineHeight: '1.6',
  textAlign: 'justify',
  color: '#aaffff'
}

const cornerStyle: React.CSSProperties = {
  position: 'absolute',
  top: '-5px',
  right: '-5px',
  width: '20px',
  height: '20px',
  borderTop: '3px solid #00ffa3',
  borderRight: '3px solid #00ffa3'
}

const actionButtonStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '10px',
  marginTop: '15px',
  border: '1px solid #00ffa3',
  color: '#00ffa3',
  textAlign: 'center',
  textDecoration: 'none',
  fontSize: '12px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  textTransform: 'uppercase'
}

useGLTF.preload('/models/cabine.glb')