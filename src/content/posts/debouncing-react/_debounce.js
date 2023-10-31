export default `export function debounce(func, duration) {
  console.log('Running debounce')

  let timeout

  return function (...args) {
    const effect = () => {
      timeout = null
      return func.apply(this, args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(effect, duration)
  }
}`
