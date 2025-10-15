import Sandpack from '../../../components/Sandpack'
import { outdent } from 'outdent'

export default function AntiPatternSubmit() {
  return (
    <Sandpack
      title='Anti-pattern: Using getValues in onSubmit'
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
              const { register, getValues, formState: { errors, submitCount } } = useForm({
                defaultValues: { email: '', password: '' }
              });

              const handleSubmit = (e) => {
                e.preventDefault();
                const values = getValues();
                // Simulate API call
                alert('Form submitted ' + submitCount + ' times with: ' + JSON.stringify(values));
              };

              return (
                <form onSubmit={handleSubmit}>
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
