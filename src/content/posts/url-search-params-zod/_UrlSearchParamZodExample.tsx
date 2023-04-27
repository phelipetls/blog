import Sandpack from '@components/Sandpack'

export default function ZodExample() {
  return (
    <Sandpack
      template="react"
      title="An example of parsing a URL search param with Zod"
      initialURL="/?pageNumber=3"
      shouldShowNavigator
      customSetup={{
        dependencies: {
          zod: '^3.21.4',
        },
      }}
      files={{
        'App.js': {
          code: `import z from 'zod'
import * as React from 'react'

export default function App() {
  const searchParams = new URLSearchParams(window.location.search)

  const pageNumberRaw = searchParams.get('pageNumber')
  const pageNumber = z.number().catch(0).parse(Number(pageNumberRaw))

  return <pre>{JSON.stringify({ pageNumber, pageNumberRaw }, null, 2)}</pre>
}
`,
        },
      }}
    />
  )
}
