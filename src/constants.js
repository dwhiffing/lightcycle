import { LEVEL1, LEVEL2, LEVEL3 } from './minos'
export * from './minos'

export const TIME_DURATION = 10000
export const Y_OFFSET = 55

export const TILE_CONNECTIONS = {
  2: { down: [2, 4, 7], up: [2, 5, 6] },
  3: { right: [3, 5, 7], left: [3, 4, 6] },
  4: { up: [2, 5, 6], right: [3, 5, 7] },
  5: { down: [2, 4, 7], left: [3, 4, 6] },
  6: { down: [2, 4, 7], right: [3, 5, 7] },
  7: { up: [2, 5, 6], left: [3, 4, 6] },
}

export const TILE_DIRECTIONS = {
  2: { up: 'up', down: 'down' },
  3: { left: 'left', right: 'right' },
  4: { down: 'right', left: 'up' },
  5: { up: 'left', right: 'down' },
  6: { left: 'down', up: 'right' },
  7: { down: 'left', right: 'up' },
}

export const DIRECTION_ADJACENCY = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
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
