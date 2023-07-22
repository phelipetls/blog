import Sandpack from '@components/Sandpack'
import outdent from 'outdent'

export default function () {
  return (
    <Sandpack
      template='react'
      files={{
        '/App.js': outdent`
           import { useForm } from 'react-hook-form'

           export default function App() {
             const { handleSubmit, register } = useForm()

             const onSubmit = (d) => {
               alert(JSON.stringify(d))
             }

             return (
               <form onSubmit={handleSubmit(onSubmit)}>
                 <label>
                   Name:
                   <input {...register('name')} />
                 </label>

                 <div />

                 <label>
                   Age:
                   <input
                     type="number"
                     {...register('age', {
                       valueAsNumber: true,
                     })}
                   />
                 </label>

                 <div />

                 <button>Submit</button>
               </form>
             )
           }
      `,
      }}
      customSetup={{
        dependencies: {
          react: '^18.0.0',
          'react-dom': '^18.0.0',
          'react-hook-form': '^7.39.5',
        },
      }}
    />
  )
}
