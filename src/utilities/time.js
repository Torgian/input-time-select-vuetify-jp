
/**
 * Parse MMhh
 * @param String mmhh Time e.g.) "01:23"
 * @return Array e.g.) [1, 23]
 */
export function parseTime(mmhh) {
  const match = mmhh.match(/^(\d{2}|\d):(\d{2})$/)

  if (match) return [Number(match[1]), Number(match[2])]

  return null
}
