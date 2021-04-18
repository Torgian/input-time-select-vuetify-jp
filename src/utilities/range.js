/**
 * Generate range of numbers
 * @param Number Begin number
 * @param Number End number
 * @param Number figure Zero padding figure
 * @return Array
 * @example range(2, 5, 3) // ['002', '003', '004', '005']
 * @example range(0, 26).map(hour => (24 <= hour) ? `翌${hour - 24}` : hour) // ['0', '1', ..., '23', '翌0', '翌1', '翌2']
 */
export default function range(begin, end, figure = 0) {
  const numbers = []

  for (let i = begin; i <= end; i++) {
    let value = String(i)

    if (2 <= figure) value = value.padStart(figure, '0')

    numbers.push(value)
  }

  return numbers
}
