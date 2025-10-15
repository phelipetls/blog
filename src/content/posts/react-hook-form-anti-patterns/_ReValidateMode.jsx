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
          zod: '3.22.4',
          '@hookform/resolvers': '3.3.4',
        },
      }}
      files={{
        '/App.js': {
          code: outdent`
            import { useForm } from 'react-hook-form';
            import { zodResolver } from '@hookform/resolvers/zod';
            import * as z from 'zod';

            const schema = z.object({
              email: z.string().min(1, 'Email is required').email('Invalid email'),
              password: z.string().min(6, 'Password must be at least 6 characters'),
            });

            function App() {
              const { register, formState: { errors } } = useForm({
                defaultValues: { email: '', password: '' },
                resolver: zodResolver(schema),
                mode: 'onChange',
                reValidateMode: 'onChange'
              });

              return (
                <form onSubmit={e => e.preventDefault()}>
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
