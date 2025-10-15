import Sandpack from '../../../components/Sandpack'
import { outdent } from 'outdent'

export default function ExcessiveTrigger() {
  return (
    <Sandpack
      title='Anti-pattern: Excessive use of trigger'
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
              const { watch, setValue, trigger, formState: { errors } } = useForm({
                defaultValues: { email: '', password: '' },
                resolver: zodResolver(schema),
              });
              const email = watch('email');
              const password = watch('password');

              return (
                <form>
                  <div>
                    <label>Email:</label>
                    <input
                      value={email}
                      onChange={(e) => {
                        setValue('email', e.target.value);
                        trigger('email');
                      }}
                    />
                    {errors.email && <div style={{ color: 'red' }}>{errors.email.message}</div>}
                  </div>
                  <div>
                    <label>Password:</label>
                    <input
                      value={password}
                      onChange={(e) => {
                        setValue('password', e.target.value);
                        trigger('password');
                      }}
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
