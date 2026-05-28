# Frontend 3D Car - Projeto de Rastreamento de Veículo

## 📋 Descrição

Projeto desenvolvido para o teste técnico de frontend, consistindo em uma aplicação que visualiza o rastreamento de um veículo em um mapa interativo, com animação de sprite baseada na direção e velocidade do veículo.

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18**: Biblioteca JavaScript para construção de interfaces
  - Motivo: Amplamente adotado no mercado, grande comunidade, componentes reutilizáveis
  
- **Leaflet + React-Leaflet**: Biblioteca de mapas open-source
  - Motivo: Leve, flexível, não requer chave de API (diferente do Google Maps)
  
- **SCSS/Sass**: Pré-processador CSS
  - Motivo: Variáveis, mixins, aninhamento e melhor organização do código
  
- **React-Intl**: Biblioteca de internacionalização
  - Motivo: Suporte a múltiplos idiomas, formatação de datas/números
  
- **Context API**: Gerenciamento de estado
  - Motivo: Solução nativa do React, evita prop drilling

### Ferramentas
- **Git**: Versionamento de código
- **npm**: Gerenciamento de pacotes

## 📁 Estrutura do Projeto
frontend-3d-car/
├── public/
│ ├── index.html
│ └── sprites/
│ └── car-sprite.png (sprite sheet com 72 frames)
├── src/
│ ├── components/
│ │ ├── CarSprite/ (Componente de animação do carro)
│ │ ├── Map/ (Componente de mapa)
│ │ ├── RouteSelector/ (Seletor de rotas)
│ │ └── VehicleInfo/ (Informações do veículo)
│ ├── contexts/
│ │ └── VehicleContext.jsx (Estado global)
│ ├── hooks/
│ │ ├── useVehicleAnimation.js (Hook de animação)
│ │ └── useGPSData.js (Hook de dados GPS)
│ ├── i18n/
│ │ └── locales/ (Arquivos de tradução)
│ ├── services/
│ │ └── gpsService.js (Processamento de dados GPS)
│ ├── styles/
│ │ ├── variables.scss (Variáveis SCSS)
│ │ ├── mixins.scss (Mixins reutilizáveis)
│ │ └── global.scss (Estilos globais)
│ ├── utils/
│ │ ├── spriteCalculator.js (Cálculos de sprite)
│ │ └── coordinateUtils.js (Utilitários de coordenadas)
│ ├── App.jsx
│ └── index.js
└── README.md


## 🔧 Instalação e Execução

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn

### Passos

1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd frontend-3d-car


npm install
# ou
yarn install


npm start
# ou
yarn start

