import Sandpack from '../../../components/Sandpack'
import { outdent } from 'outdent'

export default function AntiPatternWatchSetValue() {
  return (
    <Sandpack
      title='Anti-pattern: Using watch and setValue for controlled input'
      template='react'
      customSetup={{
        dependencies: {
          'react-hook-form': '7.51.0',
        },
      }}
      files={{
        '/App.js': {
          code: outdent`
            import { useForm } from 'react-hook-form';

            let rerenderCount = 0

            function App() {
              rerenderCount++
              const { watch, setValue } = useForm({ defaultValues: { name: '' } });
              const name = watch('name');

              return (
                <>
                  <label>
                    Name: <input
                      value={name}
                      onChange={(e) => {
                        setValue('name', e.target.value);
                      }}
                    />
                  </label>
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
