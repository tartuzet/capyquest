import type { LevelData } from '../types';

const baseGround = { x: 480, y: 510, width: 960, height: 60 };

export const levels: LevelData[] = [
  {
    id: 1,
    name: 'La Orilla del Rio',
    theme: 'Tutorial basico cerca del agua.',
    playerStart: { x: 80, y: 420 },
    goal: { x: 890, y: 410, width: 42, height: 100 },
    platforms: [
      baseGround,
      { x: 250, y: 410, width: 150, height: 24 },
      { x: 450, y: 340, width: 140, height: 24 },
      { x: 650, y: 285, width: 160, height: 24 },
      { x: 810, y: 425, width: 130, height: 24 }
    ],
    hazards: [
      { type: 'water', x: 545, y: 525, width: 160, height: 30 }
    ],
    collectibles: [
      { type: 'watermelon', x: 240, y: 360 },
      { type: 'watermelon', x: 450, y: 290 },
      { type: 'watermelon', x: 625, y: 235 },
      { type: 'watermelon', x: 705, y: 235 },
      { type: 'golden-seed', x: 820, y: 375 }
    ],
    enemies: [
      { kind: 'frog', x: 560, y: 460, patrolDistance: 100, speed: 45 }
    ]
  },
  {
    id: 2,
    name: 'Troncos Flotantes',
    theme: 'Plataformas moviles y ranas saltarinas.',
    playerStart: { x: 80, y: 420 },
    goal: { x: 890, y: 390, width: 42, height: 120 },
    platforms: [baseGround, { x: 300, y: 400, width: 150, height: 24, moving: { axis: 'x', distance: 120, speed: 60 } }],
    hazards: [],
    collectibles: [{ type: 'watermelon', x: 300, y: 350 }, { type: 'golden-seed', x: 740, y: 420 }],
    enemies: [{ kind: 'frog', x: 530, y: 460, patrolDistance: 120, speed: 55 }]
  },
  {
    id: 3,
    name: 'Camino de Lodo',
    theme: 'Lodo, espinas y cangrejos.',
    playerStart: { x: 80, y: 420 },
    goal: { x: 890, y: 410, width: 42, height: 100 },
    platforms: [baseGround, { x: 360, y: 390, width: 160, height: 24 }, { x: 650, y: 330, width: 150, height: 24 }],
    hazards: [{ type: 'mud', x: 250, y: 480, width: 130, height: 24 }, { type: 'spikes', x: 520, y: 470, width: 90, height: 28 }],
    collectibles: [{ type: 'watermelon', x: 360, y: 340 }, { type: 'watermelon', x: 650, y: 280 }],
    enemies: [{ kind: 'crab', x: 700, y: 460, patrolDistance: 120, speed: 65 }]
  },
  {
    id: 4,
    name: 'Bosque de Bambu',
    theme: 'Plataformas verticales y tucanes.',
    playerStart: { x: 80, y: 420 },
    goal: { x: 890, y: 320, width: 42, height: 190 },
    platforms: [baseGround, { x: 260, y: 430, width: 120, height: 24 }, { x: 450, y: 350, width: 120, height: 24 }, { x: 650, y: 270, width: 120, height: 24 }],
    hazards: [],
    collectibles: [{ type: 'watermelon', x: 450, y: 300 }, { type: 'watermelon', x: 650, y: 220 }],
    enemies: [{ kind: 'toucan', x: 560, y: 210, patrolDistance: 180, speed: 80 }]
  },
  {
    id: 5,
    name: 'Cueva de Cristal',
    theme: 'Cueva oscura con murcielagos.',
    playerStart: { x: 80, y: 420 },
    goal: { x: 890, y: 410, width: 42, height: 100 },
    platforms: [baseGround, { x: 280, y: 390, width: 140, height: 24 }, { x: 560, y: 320, width: 160, height: 24 }],
    hazards: [{ type: 'spikes', x: 410, y: 470, width: 100, height: 28 }],
    collectibles: [{ type: 'watermelon', x: 280, y: 340 }, { type: 'golden-seed', x: 560, y: 270 }],
    enemies: [{ kind: 'bat', x: 620, y: 250, patrolDistance: 160, speed: 85 }]
  },
  {
    id: 6,
    name: 'Selva Alta',
    theme: 'Hojas que desaparecen.',
    playerStart: { x: 80, y: 420 },
    goal: { x: 890, y: 350, width: 42, height: 160 },
    platforms: [baseGround, { x: 300, y: 400, width: 130, height: 24, disappearing: true }, { x: 520, y: 330, width: 130, height: 24, disappearing: true }, { x: 740, y: 270, width: 130, height: 24 }],
    hazards: [],
    collectibles: [{ type: 'watermelon', x: 520, y: 280 }],
    enemies: [{ kind: 'frog', x: 650, y: 460, patrolDistance: 110, speed: 70 }]
  },
  {
    id: 7,
    name: 'Cascada Escondida',
    theme: 'Agua y enemigos rapidos.',
    playerStart: { x: 80, y: 420 },
    goal: { x: 890, y: 390, width: 42, height: 120 },
    platforms: [baseGround, { x: 350, y: 390, width: 150, height: 24 }, { x: 640, y: 340, width: 150, height: 24 }],
    hazards: [{ type: 'water', x: 420, y: 525, width: 220, height: 30 }],
    collectibles: [{ type: 'watermelon', x: 350, y: 340 }, { type: 'watermelon', x: 640, y: 290 }],
    enemies: [{ kind: 'frog', x: 720, y: 460, patrolDistance: 130, speed: 90 }]
  },
  {
    id: 8,
    name: 'Pantano de Espinas',
    theme: 'Espinas y lodo profundo.',
    playerStart: { x: 80, y: 420 },
    goal: { x: 890, y: 410, width: 42, height: 100 },
    platforms: [baseGround, { x: 360, y: 380, width: 150, height: 24 }, { x: 690, y: 310, width: 150, height: 24 }],
    hazards: [{ type: 'mud', x: 190, y: 480, width: 180, height: 24 }, { type: 'spikes', x: 530, y: 470, width: 160, height: 28 }],
    collectibles: [{ type: 'watermelon', x: 360, y: 330 }, { type: 'watermelon', x: 690, y: 260 }],
    enemies: [{ kind: 'small-caiman', x: 760, y: 460, patrolDistance: 140, speed: 75 }]
  },
  {
    id: 9,
    name: 'Ruinas del Rio',
    theme: 'Bloques inestables y mezcla de enemigos.',
    playerStart: { x: 80, y: 420 },
    goal: { x: 890, y: 330, width: 42, height: 180 },
    platforms: [baseGround, { x: 260, y: 420, width: 120, height: 24, disappearing: true }, { x: 460, y: 350, width: 120, height: 24, disappearing: true }, { x: 680, y: 280, width: 150, height: 24 }],
    hazards: [{ type: 'spikes', x: 580, y: 470, width: 100, height: 28 }],
    collectibles: [{ type: 'watermelon', x: 460, y: 300 }, { type: 'golden-seed', x: 680, y: 230 }],
    enemies: [{ kind: 'crab', x: 740, y: 460, patrolDistance: 120, speed: 80 }, { kind: 'bat', x: 570, y: 230, patrolDistance: 140, speed: 80 }]
  },
  {
    id: 10,
    name: 'Entrada al Pantano Final',
    theme: 'Obstaculos combinados antes del boss.',
    playerStart: { x: 80, y: 420 },
    goal: { x: 890, y: 410, width: 42, height: 100 },
    platforms: [baseGround, { x: 260, y: 390, width: 130, height: 24 }, { x: 510, y: 320, width: 130, height: 24, moving: { axis: 'y', distance: 90, speed: 45 } }, { x: 760, y: 390, width: 130, height: 24 }],
    hazards: [{ type: 'mud', x: 360, y: 480, width: 150, height: 24 }, { type: 'spikes', x: 630, y: 470, width: 100, height: 28 }],
    collectibles: [{ type: 'watermelon', x: 260, y: 340 }, { type: 'watermelon', x: 760, y: 340 }],
    enemies: [{ kind: 'small-caiman', x: 700, y: 460, patrolDistance: 140, speed: 90 }]
  },
  {
    id: 11,
    name: 'El Manglar',
    theme: 'Raices traicioneras y cangrejos.',
    playerStart: { x: 80, y: 420 },
    goal: { x: 890, y: 410, width: 42, height: 100 },
    platforms: [baseGround, { x: 280, y: 400, width: 140, height: 24 }, { x: 520, y: 340, width: 140, height: 24 }, { x: 740, y: 290, width: 140, height: 24 }],
    hazards: [{ type: 'mud', x: 400, y: 490, width: 130, height: 24 }],
    collectibles: [{ type: 'watermelon', x: 280, y: 350 }, { type: 'watermelon', x: 520, y: 290 }],
    enemies: [{ kind: 'crab', x: 660, y: 460, patrolDistance: 130, speed: 70 }]
  },
  {
    id: 12,
    name: 'Dosel del Bosque',
    theme: 'Plataformas altas y tucanes.',
    playerStart: { x: 80, y: 420 },
    goal: { x: 890, y: 350, width: 42, height: 160 },
    platforms: [baseGround, { x: 250, y: 420, width: 120, height: 24 }, { x: 430, y: 360, width: 120, height: 24, moving: { axis: 'x', distance: 100, speed: 55 } }, { x: 640, y: 290, width: 120, height: 24 }, { x: 790, y: 370, width: 120, height: 24 }],
    hazards: [],
    collectibles: [{ type: 'watermelon', x: 430, y: 310 }, { type: 'golden-seed', x: 640, y: 240 }],
    enemies: [{ kind: 'toucan', x: 580, y: 230, patrolDistance: 200, speed: 90 }]
  },
  {
    id: 13,
    name: 'Caverna del Eco',
    theme: 'Murcielagos y oscuridad.',
    playerStart: { x: 80, y: 420 },
    goal: { x: 890, y: 410, width: 42, height: 100 },
    platforms: [baseGround, { x: 300, y: 390, width: 140, height: 24 }, { x: 520, y: 320, width: 140, height: 24, disappearing: true }, { x: 740, y: 370, width: 140, height: 24 }],
    hazards: [{ type: 'spikes', x: 440, y: 470, width: 120, height: 28 }],
    collectibles: [{ type: 'watermelon', x: 300, y: 340 }, { type: 'watermelon', x: 520, y: 270 }],
    enemies: [{ kind: 'bat', x: 600, y: 250, patrolDistance: 180, speed: 90 }, { kind: 'bat', x: 450, y: 300, patrolDistance: 120, speed: 80 }]
  },
  {
    id: 14,
    name: 'Cascada del Juicio',
    theme: 'Desafio final antes del boss.',
    playerStart: { x: 80, y: 420 },
    goal: { x: 890, y: 390, width: 42, height: 120 },
    platforms: [baseGround, { x: 200, y: 410, width: 140, height: 24 }, { x: 400, y: 350, width: 140, height: 24, moving: { axis: 'y', distance: 80, speed: 50 } }, { x: 600, y: 300, width: 140, height: 24, disappearing: true }, { x: 780, y: 380, width: 140, height: 24 }],
    hazards: [{ type: 'water', x: 400, y: 525, width: 280, height: 30 }, { type: 'mud', x: 160, y: 480, width: 120, height: 24 }],
    collectibles: [{ type: 'watermelon', x: 200, y: 360 }, { type: 'watermelon', x: 400, y: 300 }, { type: 'golden-seed', x: 780, y: 330 }],
    enemies: [{ kind: 'frog', x: 680, y: 460, patrolDistance: 130, speed: 85 }, { kind: 'small-caiman', x: 500, y: 460, patrolDistance: 120, speed: 80 }]
  },
  {
    id: 15,
    name: 'Guarida del Caiman',
    theme: 'Nivel final hacia el boss.',
    playerStart: { x: 80, y: 420 },
    goal: { x: 890, y: 410, width: 42, height: 100 },
    platforms: [baseGround, { x: 300, y: 390, width: 150, height: 24 }, { x: 550, y: 330, width: 150, height: 24, moving: { axis: 'x', distance: 100, speed: 65 } }, { x: 780, y: 390, width: 130, height: 24 }],
    hazards: [{ type: 'spikes', x: 450, y: 470, width: 120, height: 28 }, { type: 'mud', x: 650, y: 490, width: 120, height: 24 }],
    collectibles: [{ type: 'watermelon', x: 300, y: 340 }, { type: 'golden-seed', x: 780, y: 340 }],
    enemies: [{ kind: 'small-caiman', x: 620, y: 460, patrolDistance: 150, speed: 95 }]
  }
];

export function getLevel(id: number): LevelData {
  return levels.find((level) => level.id === id) ?? levels[0];
}
