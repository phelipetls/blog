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

```html
<form action="https://myservice.com/api/signup" method="POST">
  <label>
    Username
    <input name="username">
  </label>

  <label>
    Password
    <input name="password" type="password">
  </label>

  <input type="submit">
</form>
```

This is easy to forget (or never get to learn) when we're using React, since
we're used to use JavaScript for everything.

# Don't use a library to handle form state

I'd say that Formik or react-hook-form are staples in most React apps, but
someone could still use plain `useState` to manage form state and get away with
it during code review. Using `useState` for every input in a form is
inefficient and difficult to maintain, so it's best to avoid it.

I really like react-hook-form API. It abstracts away the DOM API needed to get
form values into a nice object, that maps input names to their values, in the
submit function.

{{< react >}}
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

      <label>
        Age:
        <input
          type="number"
          {...register('age', {
            valueAsNumber: true,
          })}
        />
      </label>

      <input type="submit" value="Submit" />
    </form>
  )
}
{{< /react >}}

This is the equivalent JavaScript code we would need if we chose not to use
react-hook-form:

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

      <label>
        Age:
        <input name="age" type="number" />
      </label>

      <input type="submit" value="Submit" />
    </form>
  )
}
{{< /react >}}

Sometimes we can't avoid working with controlled components -- in fact, that's
the most likely scenario, particularly if your team uses a UI library, but that
does not mean you should lift state up and use an unhealthy amount of
`useState` in your component. react-hook-form has an API to handle this case --
the Controller component.

# Don't use accessible elements

# Don't use aria attributes for error messages
