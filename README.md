#  Frontend 3D Car - Rastreamento de Veículo e Animação de Sprite

##  Descrição
Aplicação desenvolvida para o teste técnico de frontend, consistindo em uma interface interativa que visualiza o rastreamento de um veículo em um mapa. O projeto se destaca por implementar uma **animação fluida e realista** do sprite do carro, que se desloca e rotaciona suavemente conforme a direção e velocidade do trajeto GPS, eliminando os "pulos" tradicionais entre coordenadas.

##  Instalação e Execução

### Pré-requisitos
- Node.js (v14 ou superior)
- npm ou yarn

### Passos
1. Clone o repositório:
   ```bash
   git clone https://github.com/Matheusavilap/projetofrontend.git

2. npm install

3. npm start

4. Uma janela vai abrir no navegador, caso seja necessario mova a tela para a regiao de SANTOS - SP, ou dê um zoom out no mapa para visualizar o icone que representa a localização do veiculo, isso será corrigdo em updates posteriores, selecione a rota a velocidade e de o play para visualizar o trajeto percorrido.

##  Funcionalidades Implementadas

### 🔹 Core
- **Mapa Interativo:** Renderizado com `Leaflet` e `react-leaflet`.
- **Sprite Dinâmico:** Imagem do carro que acompanha a rota em tempo real.
- **Rotação Automática:** Cálculo trigonométrico de *bearing* (direção) entre pontos GPS para rotacionar o carro nas curvas.
- **Trajetória Visual:** Linha amarela (`Polyline`) destacando o trajeto completo.

### 🔹 Bônus & Diferenciais Técnicos
- **Animação a 60 FPS:** Loop otimizado com `requestAnimationFrame` e interpolação linear (LERP) para transição suave entre pontos.
- **Controle de Velocidade:** Slider que ajusta a velocidade da simulação em tempo real (`0.5x` a `5x`).
- **Internacionalização (i18n):** Suporte a Português (BR) e Inglês (EN) via `react-intl`, com detecção automática do idioma do navegador.
- **Otimização de Sprite Sheet:** Gerenciamento de frames via CSS `background-position` com `overflow: hidden` para evitar recortes ou anti-aliasing indesejados.
- **Seletor de Rotas & Reset:** Interface para alternar entre trajetos disponíveis e reiniciar a animação.

##  Arquitetura e Soluções Técnicas
| Desafio | Solução Implementada |
| **Pulos entre coordenadas** | Uso de `requestAnimationFrame` + interpolação linear (LERP) calculando `progress` entre o ponto atual e o próximo. |
| **Carro parado ou sem rotação** | Cálculo matemático de bearing em tempo real (`Math.atan2`) aplicado via `transform: rotate()` no CSS. |
| **Performance no React** | Estado da animação mantido em `useRef` para evitar re-renders desnecessários do React a cada frame. |
| **Sprite cortado/quebrado** | Container CSS com `overflow: hidden` e `image-rendering: crisp-edges` para frames nítidos e alinhados. |
| **Internacionalização** | `IntlProvider` no topo da árvore, arquivos `.json` por idioma e fallback para `navigator.language`. |

## Tecnologias Utilizadas
| Tecnologia | Motivo da Escolha |
| **React 18** | Componentização moderna, Hooks (`useState`, `useEffect`, `useRef`) e virtual DOM otimizado. |
| **Leaflet + React-Leaflet** | Biblioteca leve, open-source e sem necessidade de API Key. Ideal para mapas personalizados. |
| **SCSS/Sass** | Pré-processador CSS com variáveis, aninhamento e mixins para manter estilos modulares e escaláveis. |
| **react-intl** | Padrão da indústria para i18n em React, suporta formatação dinâmica e troca de idioma sem reload. |
| **requestAnimationFrame** | API nativa do browser para animações suaves sincronizadas com a taxa de atualização da tela (60Hz). |
| **Trigonometria (Math)** | Cálculo preciso de bearing e projeções geográficas para rotação e interpolação de coordenadas. |

##  Estrutura do Projeto

frontend-3d-car/
├── public/
│ └── sprites/
│ └── car-sprite.png # Sprite sheet horizontal (72 frames)
├── src/
│ ├── components/
│ │ └── CarSprite/
│ │ ├── CarSprite.jsx / Lógica de renderização e rotação do sprite
│ │ └── CarSprite.scss # Estilos de corte, fallback e transições
│ ├── i18n/
│ │ ├── index.js # Configuração e detecção de locale
│ │ └── locales/
│ │ ├── pt-BR.json # Traduções em Português
│ │ └── en.json # Traduções em Inglês
│ ├── App.jsx # Estado global, loop de animação e UI
│ ├── index.js # Entry point com IntlProvider
│ └── App.scss # Estilos globais da aplicação
├── .gitignore
├── package.json
└── README.md


