import Sandpack from '../../../components/Sandpack'
import { outdent } from 'outdent'

export default function GoodPatternController() {
  return (
    <Sandpack
      title='Good pattern: Using Controller'
      template='react'
      customSetup={{
        dependencies: {
          'react-hook-form': '7.51.0',
        },
      }}
      files={{
        '/App.js': {
          code: outdent`
            import { useForm, Controller } from 'react-hook-form';

            let rerenderCount = 0

            function App() {
              rerenderCount++
              const { control } = useForm({ defaultValues: { name: '' } });

              return (
                <>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <label>
                        Name: <input {...field} />
                      </label>
                    )}
                  />
                  <br />Re-renders: {rerenderCount}
                </>
              );
            }

            export default App;
          `,
        },
      }}
    />
  )
}
