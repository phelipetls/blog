import { useForm } from 'react-hook-form'

function App() {
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
