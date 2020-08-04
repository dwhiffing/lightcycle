import { SCORES, LEVELS } from './constants'

export const getLevelFromScore = (score) => {
  for (let key in SCORES) {
    if (score < key) return SCORES[key]
  }
  return 9
}

export const generateUpcomingMinos = (level) => {
  const types = Phaser.Math.RND.shuffle([...LEVELS[level]])
  return types.map((types) => Phaser.Math.RND.weightedPick(types))
}
