# Portfólio 3D — Marcelo Henrique

Portfólio pessoal em formato de cenário 3D interativo: uma porta que abre para
uma cabine de comando, onde um painel exibe meus projetos, minha bio e minha
stack técnica.

## Stack

- **React** + **TypeScript**
- **Vite**
- **Three.js** / **@react-three/fiber** (R3F) + **@react-three/drei**
- Modelos 3D em `.glb`, comprimidos com Draco

## Rodando localmente

```bash
npm install
npm run dev
```

Abra o endereço mostrado no terminal (geralmente `http://localhost:5173`).

Outros scripts disponíveis:

```bash
npm run build     # build de produção
npm run preview   # preview do build de produção
npm run lint      # roda o ESLint
```

## Estrutura

```
src/
├── App.tsx                     # controla a transição entre as cenas (porta -> cabine)
├── assets/portfolio.json       # dados dos projetos exibidos no painel
└── components/canvas/
    ├── CenaPorta.tsx            # cena inicial (porta)
    └── CenaCabine.tsx           # cena principal (painel de projetos, tech stack, bio)
```

Os modelos 3D ficam em `public/models/` e são versionados com **Git LFS**
(`*.glb` configurado em `.gitattributes`).

## Notas

- O site usa renderização 3D pesada; recomenda-se navegador com aceleração de
  hardware ativada.
- A lista de projetos exibida no painel vem de `src/assets/portfolio.json` —
  basta editar esse arquivo para adicionar/remover/reordenar projetos.
