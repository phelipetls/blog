---
title: How not to write forms with React
date: 2022-08-21
tags: [javascript, react]
---

Forms are easy to not get right -- you can make something work with a
`useState` and (often non-accessible) input components.

# Don't use the `form` HTML element

This is a surprisingly common one, I'd guess because React makes it easier for
us to make an arbitrary HTML elements behave like a form with JavaScript code
-- for example, one may think that it's enough to send the data to the server
on the click of a button:

{{< react >}}
import { useState } from 'react'

function App() {
  const [username, setUsername] = useState('')

  const handleSubmit = () => {
    alert(`Ok, ${username}, I sent your data to our server ✨`)
  }

  return (
    <div>
      <div>
        What's your name?

        <input
          placeholder="Enter your name..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <button onClick={handleSubmit}>
        Submit
      </button>
    </div>
  )
}
{{< /react >}}

So, what's the problem with this code? The `handleSubmit` function will
execute, shouldn't that be enough?

While that may be enough to close a ticket, it is not idiomatic HTML -- for
example, the `handleSubmit` function will not execute if the user press enter
in the text input.

Here's what I think to be more appropriate:

{{< react "hl_Lines=5-6 11 15-18 21" >}}
import { useState } from 'react'

function App() {
  const handleSubmit = (e) => {
    e.preventDefault()
    const username = e.target.elements['username'].value
    alert(`Ok, ${username}, I sent your data to our server ✨`)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        What's your name?

        <input
          name="username"
          placeholder="Enter your name..."
        />
      </label>

      <button>
        Submit
      </button>
    </form>
  )
}
{{< /react >}}

Now the form will be submitted when the user types their name and press enter
-- not just when the button is clicked. [This is just how HTML
works](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event),
no additional code was necessary -- no [keydown
event](https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event)
listeners or something silly like that.

{{< note >}}

I also replaced the `div` with a `label` element, to associate the "What's your
username" with the input element. This makes your website more accessible --
that text will be read by screen readers when the input gets focused -- and
user-friendly -- the input will gets focused when you click on the label.

{{< /note >}}

[It's possible to send data to a server without any JavaScript at
all](https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_and_retrieving_form_data#on_the_client_side_defining_how_to_send_the_data),
you can configure the HTTP request with the `action` and `method` `form`
attributes:

This is easy to forget (or to not even learn) when we're using React, since
we're just use JavaScript for everything.

# Don't use a library to handle form state

I'd say that Formik or react-hook-form are staples in most React apps, but
someone could still use plain `useState` to manage form state and get away with
it during code review. Using `useState` for every input in a form is
inefficient and difficult to maintain, so it's best to avoid it.

I really like react-hook-form, it gives you a nicely object nicely maps input
names to their values in the submit event handler:

{{< react "hl_Lines=4-7 11 14 23-25" >}}
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
{{< /react >}}

Here's the equivalent JavaScript code we'd without react-hook-form:

{{< react "hl_Lines=2-14" >}}
function App() {
  const handleSubmit = (e) => {
    e.preventDefault()

    const name = e.target.elements.name.value
    const age = e.target.elements.age.valueAsNumber

    alert(
      JSON.stringify({
        name,
        age,
      })
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input name="name" />
      </label>

      <div />

      <label>
        Age:
        <input name="age" type="number" />
      </label>

      <div />

      <button>Submit</button>
    </form>
  )
}
{{< /react >}}

There are other input components whose values are harder to parse -- without a
library you'd have to worry about handling all of them.

A form library may also help with form validation, for which you'd probably to
use a controlled component otherwise.

{{< react "hl_Lines=2-14" >}}
import { useState } from 'react'

function App() {
  const [name, setName] = useState('')
  const [age, setAge] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <div />

      <label>
        Age:
        <input
          name="age"
          required
          min="18"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
      </label>

      <div />

      <button>Submit</button>
    </form>
  )
}
{{< /react >}}

# Don't use accessible elements

# Don't use aria attributes for error messages
