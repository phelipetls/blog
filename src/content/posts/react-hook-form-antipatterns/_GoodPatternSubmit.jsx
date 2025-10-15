import Sandpack from '../../../components/Sandpack'
import { outdent } from 'outdent'

export default function GoodPatternSubmit() {
  return (
    <Sandpack
      title='Good pattern: Using handleSubmit'
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

            function App() {
              const { register, handleSubmit, formState: { errors, submitCount } } = useForm({
                defaultValues: { email: '', password: '' }
              });

              const onSubmit = (data) => {
                // Simulate API call
                alert('Form submitted ' + submitCount + ' times with: ' + JSON.stringify(data));
              };

              return (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div>
                    <label>Email:</label>
                    <input
                      {...register('email', { required: 'Email is required' })}
                    />
                    {errors.email && <div>{errors.email.message}</div>}
                  </div>
                  <div>
                    <label>Password:</label>
                    <input
                      {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                      type="password"
                    />
                    {errors.password && <div>{errors.password.message}</div>}
                  </div>
                  <button type="submit">Submit</button>
                </form>
              );
            }

            export default App;
          `,
        },
      }}
    />
  )
}
