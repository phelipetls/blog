import Sandpack from '../../../components/Sandpack'
import { outdent } from 'outdent'

export default function GoodPatternAdvanced() {
  return (
    <Sandpack
      title='Good pattern: Controller handles everything properly'
      template='react'
      shouldShowConsole={true}
      customSetup={{
        dependencies: {
          'react-hook-form': '7.51.0',
        },
      }}
      files={{
        '/App.js': {
          code: outdent`
            import { useForm, Controller } from 'react-hook-form';

            function App() {
              const { control, formState, setFocus } = useForm({
                defaultValues: { name: '' }
              });

              return (
                <div>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <label>
                        Name: <input {...field} />
                      </label>
                    )}
                  />
                  <br />
                  <button onClick={() => console.log('Dirty fields:', formState.dirtyFields)}>
                    Log Dirty Fields
                  </button>
                  <button onClick={() => setFocus('name')}>
                    Set Focus
                  </button>
                </div>
              );
            }

            export default App;
          `,
        },
      }}
    />
  )
}
