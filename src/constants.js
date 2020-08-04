import { LEVEL1, LEVEL2, LEVEL3 } from './minos'
export * from './minos'

export const MAP_SIZE_X = 12
export const MAP_SIZE_Y = 11
export const TICK = 20
export const TIME_DURATION = 10000
export const UI_Y_POS = 55
export const DIRECTIONS = ['up', 'right', 'down', 'left']
export const LINE_ANIM_DURATION = 10
export const EXPLODE_ANIM_DELAY = LINE_ANIM_DURATION * 5
export const EXPLODE_ANIM_DURATION = 600
export const LINE_ANIM_OFFSET = 200

const UP = { 0: [2, 5, 6] }
const RIGHT = { 1: [3, 5, 7] }
const DOWN = { 2: [2, 4, 7] }
const LEFT = { 3: [3, 4, 6] }

export const TILE_CONNECTIONS = {
  2: { ...DOWN, ...UP },
  3: { ...RIGHT, ...LEFT },
  4: { ...UP, ...RIGHT },
  5: { ...DOWN, ...LEFT },
  6: { ...DOWN, ...RIGHT },
  7: { ...UP, ...LEFT },
  8: { ...UP, ...RIGHT, ...DOWN, ...LEFT },
}

export const TILE_DIRECTIONS = {
  2: { 0: 0, 2: 2 },
  3: { 3: 3, 1: 1 },
  4: { 2: 1, 3: 0 },
  5: { 0: 3, 1: 2 },
  6: { 3: 2, 0: 1 },
  7: { 2: 3, 1: 0 },
  8: { 0: 0, 1: 1, 2: 2, 3: 3 },
}

export const DIRECTION_ADJACENCY = {
  0: { x: 0, y: -1 },
  2: { x: 0, y: 1 },
  3: { x: -1, y: 0 },
  1: { x: 1, y: 0 },
}

export const SCORES = {
  1000: 1,
  5000: 2,
  10000: 3,
  20000: 4,
  40000: 5,
  80000: 6,
  100000: 7,
  200000: 8,
}

export const LEVELS = [
  LEVEL1,
  LEVEL2,
  LEVEL3,
  LEVEL3,
  LEVEL3,
  LEVEL3,
  LEVEL3,
  LEVEL3,
  LEVEL3,
]
