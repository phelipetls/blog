import Sandpack from '../../../components/Sandpack'
import { outdent } from 'outdent'

export default function AntiPatternAdvanced() {
  return (
    <Sandpack
      title='Anti-pattern: Advanced issues with watch and setValue'
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
            import { useForm } from 'react-hook-form';

            function App() {
              const { watch, setValue, formState, setFocus } = useForm({
                defaultValues: { name: '' }
              });
              const name = watch('name');

              return (
                <div>
                  <label>
                    Name: <input
                      value={name}
                      onChange={(e) => setValue('name', e.target.value)}
                    />
                  </label>
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
