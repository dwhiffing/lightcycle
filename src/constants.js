import { LEVEL1, LEVEL2, LEVEL3 } from './minos'
export * from './minos'

export const EASY_LOOP = false
export const SCORE_TO_MULTI = false
  ? [-1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  : [-1, 25, 100, 250, 500, 1000, 2500, 5000, 10000]
export const MAP_SIZE_X = 12
export const MAP_SIZE_Y = 11
export const TICK = 20
export const TIMER_DURATION = 15000
export const UI_Y_POS = 55
export const DIRECTIONS = ['up', 'right', 'down', 'left']

// amount of time line takes to race around loop
export const LINE_ANIM_DURATION = 800

// amount of time between loop tile explosions
export const EXPLODE_ANIM_DELAY = 100

// amount of time tiles take to explode
export const EXPLODE_ANIM_DURATION = 400

// lengths of loop line
export const LINE_ANIM_OFFSET = 400

// amount of time between lives
export const TIME_OUT_DURATION = 1000

export const COLORS = [
  [157, 76, 218],
  [71, 96, 209],
  [74, 194, 203],
  [73, 190, 93],
  [175, 234, 72],
  [234, 228, 56],
  [231, 170, 64],
  [240, 116, 67],
  [230, 33, 33],
]

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

export const LEVELS = [
  LEVEL1,
  LEVEL1,
  LEVEL1,
  LEVEL2,
  LEVEL2,
  LEVEL2,
  LEVEL3,
  LEVEL3,
  LEVEL3,
]
