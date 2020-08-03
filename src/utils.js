import { SCORES } from './constants'
export const getMultiFromScore = (score) => {
  for (let key in SCORES) {
    if (score < key) return SCORES[key]
  }
  return 9
}
