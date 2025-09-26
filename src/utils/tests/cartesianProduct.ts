export const cartesianProduct = <T extends unknown[][]>(
  ...arrays: T
): T[number][number][][] => {
  return arrays.reduce<T[number][number][][]>(
    (acc, cur) => {
      return acc.flatMap((arr) => cur.map((item) => [...arr, item]))
    },
    [[]],
  )
}
