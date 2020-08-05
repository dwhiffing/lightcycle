import { LEVELS, EASY_LOOP } from './constants'
import { BIG_ARCH, BIG_LINE } from './minos'

export const generateUpcomingMinos = (level) => {
  if (EASY_LOOP) {
    return [BIG_ARCH, BIG_LINE]
  }
  const types = Phaser.Math.RND.shuffle([...LEVELS[level]])
  return types.map((types) => Phaser.Math.RND.weightedPick(types))
}
