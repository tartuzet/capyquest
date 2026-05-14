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
    name: 'Sube por la Cascada',
    theme: 'Rio y Selva',
    levelType: 'vertical_escape',
    worldWidth: 960,
    worldHeight: 2600,
    playerStart: { x: 120, y: 2490 },
    goal: { x: 860, y: 130, width: 56, height: 130 },
    risingHazard: { type: 'water', speed: 14, startY: 2640, startDelayMs: 1000, damageMode: 'reset' },
    perfectBonus: { type: 'all_watermelons', reward: 'extra_life' },
    platforms: [
      { x: 130, y: 2540, width: 240, height: 34 },
      { x: 320, y: 2440, width: 170, height: 24, moving: { axis: 'x', distance: 65, speed: 48 } },
      { x: 540, y: 2360, width: 150, height: 24 },
      { x: 700, y: 2270, width: 185, height: 24 },
      { x: 430, y: 2160, width: 150, height: 24, moving: { axis: 'x', distance: 55, speed: 52 } },
      { x: 250, y: 2070, width: 155, height: 24 },
      { x: 450, y: 1970, width: 205, height: 24 },
      { x: 680, y: 1880, width: 150, height: 24, moving: { axis: 'x', distance: 60, speed: 55 } },
      { x: 510, y: 1790, width: 165, height: 24 },
      { x: 300, y: 1690, width: 180, height: 24 },
      { x: 130, y: 1600, width: 145, height: 24, moving: { axis: 'x', distance: 45, speed: 45 } },
      { x: 300, y: 1510, width: 170, height: 24 },
      { x: 520, y: 1420, width: 180, height: 24 },
      { x: 740, y: 1320, width: 150, height: 24, moving: { axis: 'x', distance: 70, speed: 58 } },
      { x: 600, y: 1220, width: 185, height: 24 },
      { x: 420, y: 1110, width: 150, height: 24 },
      { x: 240, y: 1010, width: 170, height: 24 },
      { x: 420, y: 900, width: 180, height: 24 },
      { x: 640, y: 790, width: 155, height: 24, moving: { axis: 'x', distance: 55, speed: 52 } },
      { x: 470, y: 680, width: 155, height: 24 },
      { x: 300, y: 570, width: 170, height: 24 },
      { x: 510, y: 470, width: 155, height: 24, moving: { axis: 'x', distance: 55, speed: 56 } },
      { x: 700, y: 360, width: 185, height: 24 },
      { x: 800, y: 270, width: 175, height: 24 }
    ],
    hazards: [],
    collectibles: [
      { type: 'watermelon', x: 320, y: 2390 },
      { type: 'watermelon', x: 540, y: 2310 },
      { type: 'watermelon', x: 700, y: 2220 },
      { type: 'watermelon', x: 430, y: 2110 },
      { type: 'watermelon', x: 250, y: 2020 },
      { type: 'watermelon', x: 450, y: 1920 },
      { type: 'watermelon', x: 680, y: 1830 },
      { type: 'watermelon', x: 510, y: 1740 },
      { type: 'watermelon', x: 300, y: 1640 },
      { type: 'watermelon', x: 130, y: 1550 },
      { type: 'watermelon', x: 300, y: 1460 },
      { type: 'watermelon', x: 520, y: 1370 },
      { type: 'watermelon', x: 740, y: 1270 },
      { type: 'watermelon', x: 600, y: 1170 },
      { type: 'watermelon', x: 420, y: 1060 },
      { type: 'watermelon', x: 240, y: 960 },
      { type: 'watermelon', x: 420, y: 850 },
      { type: 'watermelon', x: 640, y: 740 },
      { type: 'watermelon', x: 470, y: 630 },
      { type: 'watermelon', x: 300, y: 520 },
      { type: 'watermelon', x: 510, y: 420 },
      { type: 'watermelon', x: 700, y: 310 },
      { type: 'watermelon', x: 800, y: 220 }
    ],
    enemies: []
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
    platforms: [baseGround,
      { x: 300, y: 390, width: 150, height: 24 },
      { x: 550, y: 330, width: 150, height: 24, moving: { axis: 'x', distance: 100, speed: 65 } },
      { x: 780, y: 390, width: 130, height: 24 }
    ],
    hazards: [
      { type: 'spikes', x: 450, y: 470, width: 120, height: 28 },
      { type: 'mud', x: 650, y: 490, width: 120, height: 24 }
    ],
    collectibles: [
      { type: 'watermelon', x: 300, y: 340 },
      { type: 'golden-seed', x: 780, y: 340 }
    ],
    enemies: [{ kind: 'small-caiman', x: 620, y: 460, patrolDistance: 150, speed: 95 }]
  },
  // =================== MUNDO 2: Ruinas del Volcán ===================
  {
    id: 16,
    name: 'Camino de las Ruinas',
    theme: 'Introduccion al volcan.',
    playerStart: { x: 80, y: 420 },
    goal: { x: 890, y: 410, width: 42, height: 100 },
    platforms: [baseGround,
      { x: 250, y: 410, width: 150, height: 24 },
      { x: 460, y: 350, width: 140, height: 24 },
      { x: 680, y: 290, width: 160, height: 24 },
      { x: 820, y: 410, width: 120, height: 24 }
    ],
    hazards: [
      { type: 'lava', x: 360, y: 520, width: 140, height: 20 }
    ],
    collectibles: [
      { type: 'watermelon', x: 250, y: 360 },
      { type: 'watermelon', x: 460, y: 300 },
      { type: 'golden-seed', x: 680, y: 240 }
    ],
    enemies: [{ kind: 'cave-bat', x: 560, y: 260, patrolDistance: 130, speed: 70 }]
  },
  {
    id: 17,
    name: 'Túneles de Vapor',
    theme: 'Vapor y plataformas moviles.',
    playerStart: { x: 80, y: 420 },
    goal: { x: 890, y: 410, width: 42, height: 100 },
    platforms: [baseGround,
      { x: 300, y: 410, width: 130, height: 24, moving: { axis: 'y', distance: 70, speed: 50 } },
      { x: 520, y: 340, width: 130, height: 24 },
      { x: 720, y: 300, width: 130, height: 24, moving: { axis: 'x', distance: 90, speed: 55 } },
      { x: 840, y: 390, width: 100, height: 24 }
    ],
    hazards: [
      { type: 'lava', x: 420, y: 525, width: 200, height: 20 }
    ],
    collectibles: [
      { type: 'watermelon', x: 300, y: 350 },
      { type: 'watermelon', x: 520, y: 290 },
      { type: 'golden-seed', x: 720, y: 250 }
    ],
    enemies: [
      { kind: 'iguana', x: 650, y: 460, patrolDistance: 120, speed: 60 }
    ]
  },
  {
    id: 18,
    name: 'La Montaña Quebrada',
    theme: 'Rocas que caen y plataformas quebradizas.',
    playerStart: { x: 80, y: 420 },
    goal: { x: 890, y: 410, width: 42, height: 100 },
    platforms: [baseGround,
      { x: 280, y: 410, width: 140, height: 24, breakable: true },
      { x: 500, y: 360, width: 140, height: 24 },
      { x: 700, y: 300, width: 140, height: 24, breakable: true },
      { x: 810, y: 390, width: 120, height: 24 }
    ],
    hazards: [
      { type: 'lava', x: 300, y: 525, width: 400, height: 20 }
    ],
    collectibles: [
      { type: 'watermelon', x: 500, y: 310 },
      { type: 'watermelon', x: 700, y: 250 }
    ],
    enemies: [
      { kind: 'rock-beetle', x: 400, y: 460, patrolDistance: 100, speed: 40 },
      { kind: 'cave-bat', x: 620, y: 240, patrolDistance: 140, speed: 75 }
    ]
  },
  {
    id: 19,
    name: 'Selva de Piedra',
    theme: 'Palancas, puertas y totems.',
    playerStart: { x: 80, y: 420 },
    goal: { x: 890, y: 410, width: 42, height: 100 },
    platforms: [baseGround,
      { x: 300, y: 400, width: 140, height: 24 },
      { x: 500, y: 350, width: 140, height: 24 },
      { x: 700, y: 310, width: 140, height: 24, disappearing: true },
      { x: 810, y: 390, width: 120, height: 24 }
    ],
    hazards: [
      { type: 'lava', x: 250, y: 525, width: 200, height: 20 }
    ],
    collectibles: [
      { type: 'watermelon', x: 300, y: 350 },
      { type: 'watermelon', x: 700, y: 260 },
      { type: 'golden-seed', x: 500, y: 300 }
    ],
    enemies: [
      { kind: 'totem', x: 400, y: 420, patrolDistance: 0, speed: 0 },
      { kind: 'iguana', x: 640, y: 460, patrolDistance: 110, speed: 65 }
    ],
    levers: [
      { x: 300, y: 385, doorX: 750, doorY: 370, doorWidth: 20, doorHeight: 80 }
    ]
  },
  {
    id: 20,
    name: 'Enfrentamiento: Jaguar',
    theme: 'Jefe del volcan.',
    playerStart: { x: 80, y: 420 },
    goal: { x: 890, y: 410, width: 42, height: 100 },
    platforms: [baseGround,
      { x: 300, y: 390, width: 150, height: 24 },
      { x: 550, y: 330, width: 150, height: 24 },
      { x: 780, y: 390, width: 130, height: 24 }
    ],
    hazards: [],
    collectibles: [
      { type: 'watermelon', x: 550, y: 280 },
      { type: 'golden-seed', x: 780, y: 340 }
    ],
    enemies: []
  },
  {
    id: 21,
    name: 'Cueva de Cristales',
    theme: 'Cristales afilados y serpientes.',
    playerStart: { x: 80, y: 420 },
    goal: { x: 890, y: 410, width: 42, height: 100 },
    platforms: [baseGround,
      { x: 300, y: 400, width: 140, height: 24 },
      { x: 480, y: 350, width: 140, height: 24, moving: { axis: 'y', distance: 60, speed: 40 } },
      { x: 680, y: 300, width: 140, height: 24 },
      { x: 820, y: 390, width: 110, height: 24 }
    ],
    hazards: [
      { type: 'spikes', x: 460, y: 470, width: 80, height: 28 },
      { type: 'spikes', x: 600, y: 440, width: 60, height: 28 },
      { type: 'lava', x: 200, y: 525, width: 150, height: 20 }
    ],
    collectibles: [
      { type: 'watermelon', x: 300, y: 350 },
      { type: 'golden-seed', x: 680, y: 250 }
    ],
    enemies: [
      { kind: 'cave-bat', x: 550, y: 240, patrolDistance: 140, speed: 85 },
      { kind: 'snake', x: 400, y: 460, patrolDistance: 100, speed: 55 }
    ]
  },
  {
    id: 22,
    name: 'Ascenso de Lava',
    theme: 'Ruinas del Volcan',
    levelType: 'vertical_escape',
    worldWidth: 960,
    worldHeight: 3000,
    playerStart: { x: 120, y: 2870 },
    goal: { x: 860, y: 120, width: 56, height: 130 },
    risingHazard: { type: 'lava', speed: 18, startY: 3000, startDelayMs: 1000, damageMode: 'reset' },
    perfectBonus: { type: 'all_watermelons', reward: 'extra_life' },
    platforms: [
      { x: 120, y: 2920, width: 240, height: 34 },
      { x: 320, y: 2810, width: 155, height: 24, moving: { axis: 'x', distance: 50, speed: 50 } },
      { x: 520, y: 2720, width: 145, height: 24 },
      { x: 710, y: 2630, width: 155, height: 24 },
      { x: 460, y: 2540, width: 145, height: 24 },
      { x: 250, y: 2430, width: 145, height: 24 },
      { x: 430, y: 2330, width: 145, height: 24, moving: { axis: 'x', distance: 60, speed: 56 } },
      { x: 650, y: 2230, width: 135, height: 24 },
      { x: 500, y: 2130, width: 155, height: 24 },
      { x: 300, y: 2030, width: 145, height: 24 },
      { x: 480, y: 1930, width: 155, height: 24 },
      { x: 700, y: 1830, width: 135, height: 24, moving: { axis: 'x', distance: 55, speed: 56 } },
      { x: 550, y: 1730, width: 145, height: 24 },
      { x: 350, y: 1630, width: 155, height: 24 },
      { x: 200, y: 1530, width: 135, height: 24 },
      { x: 380, y: 1420, width: 155, height: 24 },
      { x: 600, y: 1320, width: 155, height: 24 },
      { x: 770, y: 1220, width: 130, height: 24 },
      { x: 620, y: 1120, width: 155, height: 24, moving: { axis: 'x', distance: 55, speed: 58 } },
      { x: 430, y: 1020, width: 145, height: 24 },
      { x: 250, y: 910, width: 155, height: 24 },
      { x: 450, y: 810, width: 155, height: 24 },
      { x: 650, y: 700, width: 155, height: 24 },
      { x: 500, y: 590, width: 140, height: 24, moving: { axis: 'x', distance: 50, speed: 58 } },
      { x: 310, y: 490, width: 145, height: 24 },
      { x: 530, y: 380, width: 155, height: 24 },
      { x: 740, y: 260, width: 155, height: 24 }
    ],
    hazards: [],
    collectibles: [
      { type: 'watermelon', x: 320, y: 2760 },
      { type: 'watermelon', x: 520, y: 2670 },
      { type: 'watermelon', x: 710, y: 2580 },
      { type: 'watermelon', x: 460, y: 2490 },
      { type: 'watermelon', x: 250, y: 2380 },
      { type: 'watermelon', x: 430, y: 2280 },
      { type: 'watermelon', x: 650, y: 2180 },
      { type: 'watermelon', x: 500, y: 2080 },
      { type: 'watermelon', x: 300, y: 1980 },
      { type: 'watermelon', x: 480, y: 1880 },
      { type: 'watermelon', x: 700, y: 1780 },
      { type: 'watermelon', x: 550, y: 1680 },
      { type: 'watermelon', x: 350, y: 1580 },
      { type: 'watermelon', x: 200, y: 1480 },
      { type: 'watermelon', x: 380, y: 1370 },
      { type: 'watermelon', x: 600, y: 1270 },
      { type: 'watermelon', x: 770, y: 1170 },
      { type: 'watermelon', x: 620, y: 1070 },
      { type: 'watermelon', x: 430, y: 970 },
      { type: 'watermelon', x: 250, y: 860 },
      { type: 'watermelon', x: 450, y: 760 },
      { type: 'watermelon', x: 650, y: 650 },
      { type: 'watermelon', x: 500, y: 540 },
      { type: 'watermelon', x: 310, y: 440 },
      { type: 'watermelon', x: 530, y: 330 },
      { type: 'watermelon', x: 740, y: 210 }
    ],
    enemies: [],
    windZones: [
      { x: 760, y: 2500, width: 80, height: 190, forceY: -220 },
      { x: 180, y: 1760, width: 80, height: 190, forceY: -200 },
      { x: 730, y: 980, width: 85, height: 220, forceY: -250 }
    ]
  },
  {
    id: 23,
    name: 'Templo de las Semillas',
    theme: 'Llaves y totems en ruinas.',
    playerStart: { x: 80, y: 420 },
    goal: { x: 890, y: 410, width: 42, height: 100 },
    platforms: [baseGround,
      { x: 260, y: 400, width: 140, height: 24 },
      { x: 460, y: 350, width: 140, height: 24, disappearing: true },
      { x: 660, y: 300, width: 140, height: 24 },
      { x: 800, y: 370, width: 120, height: 24 }
    ],
    hazards: [
      { type: 'spikes', x: 540, y: 470, width: 80, height: 28 },
      { type: 'lava', x: 160, y: 525, width: 140, height: 20 }
    ],
    collectibles: [
      { type: 'watermelon', x: 260, y: 350 },
      { type: 'golden-seed', x: 660, y: 250 }
    ],
    enemies: [
      { kind: 'totem', x: 500, y: 420, patrolDistance: 0, speed: 0 },
      { kind: 'iguana', x: 350, y: 460, patrolDistance: 100, speed: 60 }
    ],
    levers: [
      { x: 260, y: 385, doorX: 720, doorY: 360, doorWidth: 20, doorHeight: 80 }
    ]
  },
  {
    id: 24,
    name: 'Ascenso al Crater',
    theme: 'Desafio final del volcan.',
    playerStart: { x: 80, y: 420 },
    goal: { x: 890, y: 410, width: 42, height: 100 },
    platforms: [baseGround,
      { x: 250, y: 410, width: 130, height: 24, breakable: true },
      { x: 430, y: 360, width: 140, height: 24, moving: { axis: 'x', distance: 70, speed: 65 } },
      { x: 630, y: 310, width: 140, height: 24, breakable: true },
      { x: 780, y: 380, width: 130, height: 24 }
    ],
    hazards: [
      { type: 'lava', x: 300, y: 525, width: 400, height: 20 }
    ],
    collectibles: [
      { type: 'watermelon', x: 250, y: 360 },
      { type: 'watermelon', x: 630, y: 260 },
      { type: 'golden-seed', x: 430, y: 310 }
    ],
    enemies: [
      { kind: 'cave-bat', x: 580, y: 230, patrolDistance: 160, speed: 85 },
      { kind: 'iguana', x: 700, y: 460, patrolDistance: 110, speed: 70 },
      { kind: 'rock-beetle', x: 480, y: 460, patrolDistance: 90, speed: 45 }
    ],
    windZones: [
      { x: 380, y: 200, width: 100, height: 300, forceX: -120 }
    ]
  },
  {
    id: 25,
    name: 'Enfrentamiento: Condor',
    theme: 'Jefe final del volcan.',
    playerStart: { x: 80, y: 420 },
    goal: { x: 890, y: 410, width: 42, height: 100 },
    platforms: [baseGround,
      { x: 300, y: 390, width: 150, height: 24 },
      { x: 550, y: 330, width: 150, height: 24 },
      { x: 780, y: 390, width: 130, height: 24 }
    ],
    hazards: [
      { type: 'lava', x: 430, y: 525, width: 220, height: 20 }
    ],
    collectibles: [
      { type: 'watermelon', x: 300, y: 340 },
      { type: 'watermelon', x: 550, y: 280 },
      { type: 'golden-seed', x: 780, y: 340 }
    ],
    enemies: [
      { kind: 'fire-bird', x: 620, y: 230, patrolDistance: 150, speed: 95 },
      { kind: 'cave-bat', x: 460, y: 250, patrolDistance: 130, speed: 85 }
    ]
  }
];

export function getLevel(id: number): LevelData {
  return levels.find((level) => level.id === id) ?? levels[0];
}
