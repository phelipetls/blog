import Sandpack, { type SandpackProps } from '@components/Sandpack'

type Props = SandpackProps & {
  debounceCode: string
}

export default function DebounceReactNaiveExample(props: Props) {
  return (
    <Sandpack
      {...props}
      title='Implementing debounced event handler in React in a naive way'
      template='react'
      files={{
        '/App.js': `import { debounce } from './debounce.js'

export default function App() {
  return <button onClick={debounce(() => console.log('I ran'), 300)}>Click me</button>
}
`,
        '/debounce.js': props.debounceCode,
      }}
    />
  )
}
