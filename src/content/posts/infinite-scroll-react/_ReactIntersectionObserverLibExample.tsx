import Sandpack from '@components/Sandpack'

export default function ReactIntersectionObserverExample() {
  return (
    <Sandpack
      title='An example showing how intersection observer can be used in React'
      template='react'
      customSetup={{
        dependencies: {
          'react-intersection-observer': '9.5.2',
        },
      }}
      files={{
        '/App.js': `import { useInView } from 'react-intersection-observer'

export default function App() {
  const { ref: target, inView } = useInView()

  return (
    <div
      ref={target}
      style={{
        display: 'grid',
        placeItems: 'center',
        backgroundColor: inView ? 'green' : 'red',
        transition: 'background-color 500ms ease-in-out',
        height: 100,
      }}
    >
      I'm being observed
    </div>
  )
}
`,
      }}
    />
  )
}
