import { logger } from '@/logger'

import MersenneTwister19937 from './twister'

export const randomInt = (
  options:
    | number
    | {
        /**
         * Lower bound for generated number.
         *
         * @default 0
         */
        min?: number
        /**
         * Upper bound for generated number.
         *
         * @default Number.MAX_SAFE_INTEGER
         */
        max?: number
      } = {},
): number => {
  if (typeof options === 'number') {
    options = { max: options }
  }

  const { min = 0, max = Number.MAX_SAFE_INTEGER } = options
  const effectiveMin = Math.ceil(min)
  const effectiveMax = Math.floor(max)

  if (effectiveMin === effectiveMax) {
    return effectiveMin
  }

  if (effectiveMax < effectiveMin) {
    if (max >= min) {
      logger.error(`No integer value between ${min} and ${max} found.`)
    }

    logger.error(`Max ${max} should be greater than min ${min}.`)
  }

  const twister = new MersenneTwister19937()
  const real = twister.genrandReal2()
  return Math.floor(real * (effectiveMax + 1 - effectiveMin) + effectiveMin)
}

export const randomFloat = (
  options:
    | number
    | {
        /**
         * Lower bound for generated number.
         *
         * @default 0.0
         */
        min?: number
        /**
         * Upper bound for generated number.
         *
         * @default 1.0
         */
        max?: number
        /**
         * Precision of the generated number.
         *
         * @default 0.01
         */
        precision?: number
      } = {},
): number => {
  if (typeof options === 'number') {
    options = {
      max: options,
    }
  }

  const { min = 0, max = 1, precision } = options

  if (max === min) {
    return min
  }

  if (max < min) {
    logger.error(`Max ${max} should be greater than min ${min}.`)
  }

  if (precision !== undefined) {
    if (precision <= 0) {
      logger.error(`Precision should be greater than 0.`)
    }

    const factor = 1 / precision
    const int = randomInt({
      min: min * factor,
      max: max * factor,
    })
    return int / factor
  }

  const twister = new MersenneTwister19937()
  const real = twister.genrandReal2()
  return real * (max - min) + min
}
