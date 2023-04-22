// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const cartesianProduct = (...arrays: any[][]) => {
  return arrays.reduce((acc, cur) => {
    return acc.flatMap((arr) => cur.map((item) => [arr, item].flat()))
  })
}
