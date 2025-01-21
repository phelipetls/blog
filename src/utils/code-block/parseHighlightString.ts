import _ from 'lodash'

// Parse something like { '1-3': true, '5': true } into the array of numbers [1,2,3,5]
export function parseHighlightString(highlight: string) {
  const result = Object.keys(JSON.parse(highlight)).flatMap(
    (lineNumberOrRange) => {
      const isRange = lineNumberOrRange.includes('-')

      if (isRange) {
        const [start, end] = lineNumberOrRange.split('-')
        return _.range(Number(start), Number(end) + 1)
      }

      return Number(lineNumberOrRange)
    }
  )
  return result
}
