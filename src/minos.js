export const WILDCARD = [[-1, -1, -1, -1, 8, -1, -1, -1, -1]]

export const SMALL_LINE = [
  [-1, -1, -1, -1, 2, -1, -1, -1, -1],
  [-1, -1, -1, -1, 3, -1, -1, -1, -1],
]

export const BIG_LINE = [
  [-1, 2, -1, -1, 2, -1, -1, 2, -1],
  [-1, -1, -1, 3, 3, 3, -1, -1, -1],
]

export const SMALL_SNAKE_LEFT = [
  [-1, -1, -1, 3, 5, -1, -1, 4, 3],
  [-1, -1, 2, -1, 6, 7, -1, 2, -1],
]

export const SMALL_SNAKE_RIGHT = [
  [-1, -1, -1, -1, 6, 3, 3, 7, -1],
  [2, -1, -1, 4, 5, -1, -1, 2, -1],
]

export const BIG_SNAKE_LEFT = [
  [3, 5, -1, -1, 2, -1, -1, 4, 3],
  [-1, -1, 2, 6, 3, 7, 2, -1, -1],
]

export const BIG_SNAKE_RIGHT = [
  [-1, 6, 3, -1, 2, -1, 3, 7, -1],
  [2, -1, -1, 4, 3, 5, -1, -1, 2],
]

export const SMALL_CORNER = [
  [-1, -1, -1, -1, 4, -1, -1, -1, -1],
  [-1, -1, -1, -1, 6, -1, -1, -1, -1],
  [-1, -1, -1, -1, 5, -1, -1, -1, -1],
  [-1, -1, -1, -1, 7, -1, -1, -1, -1],
]

export const MEDIUM_CORNER = [
  [-1, 2, -1, -1, 4, 3, -1, -1, -1],
  [-1, -1, -1, -1, 6, 3, -1, 2, -1],
  [-1, -1, -1, 3, 5, -1, -1, 2, -1],
  [-1, 2, -1, 3, 7, -1, -1, -1, -1],
]

export const BIG_CORNER = [
  [2, -1, -1, 2, -1, -1, 4, 3, 3],
  [6, 3, 3, 2, -1, -1, 2, -1, -1],
  [3, 3, 5, -1, -1, 2, -1, -1, 2],
  [-1, -1, 2, -1, -1, 2, 3, 3, 7],
]

export const LEFT_BEND = [
  [-1, -1, 2, -1, -1, 2, -1, 3, 7],
  [-1, -1, -1, 2, -1, -1, 4, 3, 3],
  [6, 3, -1, 2, -1, -1, 2, -1, -1],
  [3, 3, 5, -1, -1, 2, -1, -1, -1],
]

export const RIGHT_BEND = [
  [2, -1, -1, 2, -1, -1, 4, 3, -1],
  [-1, -1, -1, -1, -1, 2, 3, 3, 7],
  [-1, 3, 5, -1, -1, 2, -1, -1, 2],
  [6, 3, 3, 2, -1, -1, -1, -1, -1],
]

export const SMALL_ARCH = [
  [6, 3, 5, 2, -1, 2, -1, -1, -1],
  [-1, 3, 5, -1, -1, 2, -1, 3, 7],
  [-1, -1, -1, 2, -1, 2, 4, 3, 7],
  [6, 3, -1, 2, -1, -1, 4, 3, -1],
]

export const BIG_ARCH = [
  [6, 3, 5, 2, -1, 2, 2, -1, 2],
  [3, 3, 5, -1, -1, 2, 3, 3, 7],
  [2, -1, 2, 2, -1, 2, 4, 3, 7],
  [6, 3, 3, 2, -1, -1, 4, 3, 3],
]

export const LEVEL1 = [
  [SMALL_LINE],
  [SMALL_CORNER],
  [SMALL_CORNER],
  [SMALL_CORNER],
  [SMALL_LINE, SMALL_CORNER],
  [BIG_LINE, MEDIUM_CORNER],
  [WILDCARD],
]
export const LEVEL2 = [
  [SMALL_LINE],
  [SMALL_CORNER],
  [SMALL_LINE, SMALL_CORNER],
  [SMALL_LINE, SMALL_CORNER],
  [BIG_LINE, MEDIUM_CORNER],
  [BIG_LINE, MEDIUM_CORNER, LEFT_BEND, RIGHT_BEND, BIG_CORNER],
  [WILDCARD],
]
export const LEVEL3 = [
  [SMALL_CORNER],
  [SMALL_LINE, SMALL_CORNER],
  [SMALL_LINE, SMALL_CORNER],
  [SMALL_LINE, SMALL_CORNER],
  [BIG_LINE, MEDIUM_CORNER],
  [
    BIG_LINE,
    MEDIUM_CORNER,
    LEFT_BEND,
    RIGHT_BEND,
    BIG_CORNER,
    SMALL_ARCH,
    BIG_ARCH,
  ],
  [SMALL_SNAKE_LEFT, SMALL_SNAKE_RIGHT, BIG_SNAKE_LEFT, BIG_SNAKE_RIGHT],
  [WILDCARD],
]

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
