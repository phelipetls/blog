import Sandpack, { type SandpackProps } from '@components/Sandpack'

type Props = SandpackProps & {
  debounceCode: string
}

export default function DebounceExample(props: Props) {
  return (
    <Sandpack
      {...props}
      title='A button with a debounced onClick event handler'
      template='vanilla'
      files={{
        '/index.js': `import { debounce } from './debounce.js'

const button = document.createElement('button')
button.textContent = 'Click me'
button.addEventListener('click', debounce(() => {
  console.log('I ran')
}, 300))

app.appendChild(button)
`,
        '/debounce.js': props.debounceCode,
      }}
    />
  )
}
