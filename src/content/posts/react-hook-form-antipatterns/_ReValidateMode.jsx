import Sandpack from '../../../components/Sandpack'
import { outdent } from 'outdent'

export default function ReValidateMode() {
  return (
    <Sandpack
      title='Good pattern: Using reValidateMode'
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
              const { register, formState: { errors } } = useForm({
                defaultValues: { email: '', password: '' },
                mode: 'onChange',
                reValidateMode: 'onChange'
              });

              return (
                <form>
                  <div>
                    <label>Email:</label>
                    <input
                      {...register('email', { required: 'Email is required' })}
                    />
                    {errors.email && <div style={{ color: 'red' }}>{errors.email.message}</div>}
                  </div>
                  <div>
                    <label>Password:</label>
                    <input
                      {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                      type="password"
                    />
                    {errors.password && <div style={{ color: 'red' }}>{errors.password.message}</div>}
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
