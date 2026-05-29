# Frontend 3D Car - Rastreamento de Veículo e Animação de Sprite

## 📋 Descrição
Aplicação desenvolvida para simular o rastreamento de veículos em tempo real utilizando dados GPS. O projeto destaca-se por implementar uma animação fluida (estilo "Uber-like") onde o cursor do carro se move suavemente entre pontos geográficos, rotacionando automaticamente conforme a direção da rota, sem "pulos" ou travamentos.

## ✨ Funcionalidades e Diferenciais Técnicos

- **Animação de Alta Performance**: Implementação de loop via `requestAnimationFrame` para garantir 60 FPS e atualização contínua, evitando os problemas de agitação comuns com `setInterval`.
- **Interpolação Linear (LERP)**: Cálculo matemático para preencher os espaços entre os pontos GPS, criando uma transição suave de posição (Latitude/Longitude).
- **Rotação Dinâmica (Bearing)**: Algoritmo trigonométrico executado em tempo real para calcular o ângulo entre o ponto atual e o próximo, garantindo que o carro faça as curvas corretamente.
- **Gerenciamento de Sprite Sheet**: Correção de problemas de recorte de imagem e renderização no Leaflet usando `overflow: hidden` e manipulação direta de `background-position`.
- **Controle de Velocidade**: Slider para ajustar a velocidade da simulação em tempo real (`0.5x` a `5x`).
- **Rota Persistente**: Renderização garantida da linha do trajeto (`Polyline`) e centralização automática do mapa.

## 🚀 Tecnologias Utilizadas

| Tecnologia | Uso Principal |
| :--- | :--- |
| **React 18** | Componentização, Hooks (`useState`, `useEffect`, `useRef`) |
| **Leaflet + React-Leaflet** | Renderização do mapa, `MapContainer`, `Marker`, `Polyline` |
| **SCSS / Sass** | Estilização avançada, recorte de sprite e transições CSS |
| **Trigonometria** | Cálculo de Bearing (direção) e projeção geográfica |
| **requestAnimationFrame** | Loop de animação nativo do navegador para suavidade máxima |

## 📁 Estrutura do Projeto

```text
frontend-3d-car/
├── public/
│   └── sprites/
│       └── car-sprite.png  # Sprite sheet horizontal com 72 frames
├── src/
│   ├── components/
│   │   ├── CarSprite/
│   │   │   ├── CarSprite.jsx   # Lógica de rotação e troca de frames via DOM
│   │   │   └── CarSprite.scss  # Estilos de recorte (overflow) e transição
│   │   └── Map/
│   │       └── Map.jsx         # Componente de mapa, controles e integração
│   ├── utils/
│   │   └── coordinateUtils.js  # Funções matemáticas para GPS e Bearing
│   ├── App.jsx                 # Gerenciamento de estado global e loop de animação
│   └── index.js
└── README.md