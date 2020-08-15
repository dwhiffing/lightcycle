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
  [SMALL_LINE],
  [BIG_LINE],
  [SMALL_CORNER],
  [SMALL_CORNER],
]

export const LEVEL2 = [
  [SMALL_LINE],
  [SMALL_LINE],
  [BIG_LINE],
  [SMALL_CORNER],
  [SMALL_CORNER],
  [MEDIUM_CORNER],
]

export const LEVEL3 = [
  [SMALL_LINE],
  [SMALL_LINE],
  [BIG_LINE],
  [SMALL_CORNER],
  [SMALL_CORNER],
  [MEDIUM_CORNER, BIG_CORNER],
]

export const LEVEL4 = [
  [SMALL_LINE],
  [SMALL_LINE],
  [SMALL_LINE],
  [BIG_LINE],
  [BIG_LINE],
  [SMALL_CORNER],
  [SMALL_CORNER],
  [SMALL_CORNER],
  [MEDIUM_CORNER],
  [LEFT_BEND, RIGHT_BEND, BIG_CORNER],
]

export const LEVEL5 = [
  [SMALL_LINE],
  [SMALL_LINE],
  [SMALL_LINE],
  [BIG_LINE],
  [BIG_LINE],
  [SMALL_CORNER],
  [SMALL_CORNER],
  [SMALL_CORNER],
  [MEDIUM_CORNER],
  [LEFT_BEND, RIGHT_BEND, SMALL_SNAKE_LEFT, SMALL_SNAKE_RIGHT, BIG_CORNER],
]

export const LEVEL6 = [
  [SMALL_LINE],
  [SMALL_LINE],
  [BIG_LINE],
  [BIG_LINE],
  [SMALL_CORNER],
  [SMALL_CORNER],
  [MEDIUM_CORNER],
  [MEDIUM_CORNER],
  [LEFT_BEND, RIGHT_BEND, SMALL_SNAKE_LEFT, SMALL_SNAKE_RIGHT, BIG_CORNER],
]

export const LEVEL7 = [
  [SMALL_LINE],
  [SMALL_LINE],
  [SMALL_LINE],
  [BIG_LINE],
  [BIG_LINE],
  [SMALL_CORNER],
  [SMALL_CORNER],
  [SMALL_CORNER],
  [SMALL_CORNER],
  [MEDIUM_CORNER],
  [LEFT_BEND, RIGHT_BEND, BIG_CORNER],
  [SMALL_SNAKE_LEFT, SMALL_SNAKE_RIGHT, BIG_SNAKE_LEFT, BIG_SNAKE_RIGHT],
]

export const LEVEL8 = [
  [SMALL_LINE],
  [SMALL_LINE],
  [SMALL_LINE],
  [BIG_LINE],
  [BIG_LINE],
  [SMALL_CORNER],
  [SMALL_CORNER],
  [SMALL_CORNER],
  [MEDIUM_CORNER],
  [MEDIUM_CORNER],
  [LEFT_BEND, RIGHT_BEND, BIG_CORNER],
  [
    SMALL_SNAKE_LEFT,
    SMALL_SNAKE_RIGHT,
    BIG_SNAKE_LEFT,
    BIG_SNAKE_RIGHT,
    SMALL_ARCH,
  ],
]

export const LEVEL9 = [
  [SMALL_LINE],
  [SMALL_LINE],
  [SMALL_LINE],
  [BIG_LINE],
  [BIG_LINE],
  [SMALL_CORNER],
  [SMALL_CORNER],
  [SMALL_CORNER],
  [MEDIUM_CORNER],
  [MEDIUM_CORNER],
  [LEFT_BEND, RIGHT_BEND, BIG_CORNER],
  [
    SMALL_SNAKE_LEFT,
    SMALL_SNAKE_RIGHT,
    BIG_SNAKE_LEFT,
    BIG_SNAKE_RIGHT,
    SMALL_ARCH,
    BIG_ARCH,
  ],
]
