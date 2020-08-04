import { LEVELS, EASY_LOOP } from './constants'
import { BIG_ARCH } from './minos'

export const generateUpcomingMinos = (level) => {
  if (EASY_LOOP) {
    return [BIG_ARCH]
  }
  const types = Phaser.Math.RND.shuffle([...LEVELS[level]])
  return types.map((types) => Phaser.Math.RND.weightedPick(types))
}
