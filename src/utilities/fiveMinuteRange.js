/**
 *
 * @param Number begin number
 * @param Number end number
 * @return Array
 * @example fiveMinuteRange(0, 55) // ['05, 10, 15' ... '55']
 */
export default function fiveMinuteRange(begin, end) {
  const numbers = []

  for (let i = begin; i <= end; i += 5) {
    let value = String(i)

    if (i < 10) value = value.padStart(2, '0')

    numbers.push(value)
  }

  return numbers
}
