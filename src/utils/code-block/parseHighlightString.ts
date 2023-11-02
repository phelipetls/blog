import _ from 'lodash'

// Parse something like 1-3,5 into the array of numbers [1,2,3,5]
export function parseHighlightString(highlight: string) {
  return highlight.split(',').flatMap((lineNumberOrRange) => {
    const isRange = lineNumberOrRange.includes('-')

    if (isRange) {
      const [start, end] = lineNumberOrRange.split('-')
      return _.range(Number(start), Number(end) + 1)
    }

    return Number(lineNumberOrRange)
  })
}
