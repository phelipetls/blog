---
title: How not to write forms with React
date: 2022-08-28
tags: [javascript, react]
---

Forms are easy to get wrong with React because we can achieve their goal, which
is to make a network request when on submission, with any arbitrary HTML and
JavaScript.

People often learn React with a strong focus on JavaScript -- HTML and CSS are
often treated as second-class citizens --, so we're more likely to write
unidiomatic HTML.

Let's look at some examples of bad forms and how to improve them.

# Don't use the `form` HTML element

The `form` HTML is used to send data to a server and it doesn't need any
JavaScript to do this: you can configure the network request with HTML
attributes, like `method` and `action`. React developers never use it because
we're building Single Page Applications and we want to make the network request
in the background, whereas a plain HTML form will navigate to a new page after
submitted (that's why we always need to use `(e) => { e.preventDefault() }` in
the `onSubmit` handler).

Nevertheless, it's still important to use the `form` element, because it's a
part of the web since its inception and users are used to its functionality.

For example, here's a "form" that don't use any semantic elements:

{{< react path="bad-form.jsx" >}}

This is only a "form" in the sense that it'll send a network request when you
click the submit button.

One problem with it is it's not accessible -- the inputs have no label, so
screen readers won't be able to help visually impaired users to understand the
form.

Also, the user won't be able to submit it by pressing <kbd>Enter</kbd> while in
a text input, which can be frustrating because it's not how most forms on the
web behave.

Let's fix it by using proper HTML elements:

{{< react path="good-form.jsx" hl_options=`hl_Lines=3-5 9-16` >}}

Now we can submit the form by pressing <kbd>Enter</kbd> and the inputs are more
accessible.

Another difference is that we're using uncontrolled components now -- we're not
using `useState` to handle the form state, we're letting the browser handle it
and we just retrieve the input's value during form submission with
[`form.elements`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/elements).

This is more performant because your component won't re-render at every
keystroke. But this usually won't be a problem and, in fact, [React
documentation seems to encourage using controlled components for
forms](https://reactjs.org/docs/forms.html), which is in contrast to React form
libraries like Formik and react-hook-form, that embrace uncontrolled
components.

Controlled components are easier to work with, since it's just another React
state -- you won't need learn the DOM API needed to get an input's value when
validating or submitting a form. Using form libraries will abstract that away
from you, along with many other benefits, so let's look into those.

# Don't use a library to handle form state

React form libraries like Formik and react-hook-form are staples in most React
apps nowadays, because they can help manage form state while abstracting the
DOM API necessary to do it.

For example, react-hook-form will give you an object that maps input names to
their values as an argument to the onSubmit handler:

{{< react path="react-hook-form.jsx" hl_options=`hl_Lines=4-7 11 14 23-25` >}}

Here's the equivalent JavaScript code we'd need if we chose not to use
react-hook-form:

{{< react path="form-without-lib.jsx" hl_options=`hl_Lines=2-14` >}}

Apart from that, it'll help you validate a form, if an input is dirty
(different than default value) or touched (focused and then blurred) -- which
are often things we need to provide a better user experience when dealing with
forms.

# Don't associate the submit button with the form

When a button (or an `<input type="submit">`) is inside a `form` element, it
gets automatically associated with it, meaning it'll submit the form
automatically when you click on it (unless the button has `type="button"`).

But sometimes we want to submit the form by clicking on a button outside of it,
how can we associate them in this case? By using the [`form`
attribute](https://www.w3schools.com/tags/att_form.asp).

We not always have complete control over the HTML though -- for instance, I
recently had to use a Modal component whose "confirm" button was not
arbitrarily customizable, I could just change its text and onClick handler, so
there was no way to pass the `form` attribute to it:

```jsx
<Modal
  title='Title'
  confirmBtnText='Submit'
  onConfirmBtnClick={formik.submitForm}
>
  <form>
    <input id="name" name="name" type="text">
  </form>
</Modal>
```

Of course, being able to pass a handler to the button's `onClick` event is
enough to submit the form -- which is what I want. I confess this is kind of a
nitpick, but I was frustrated by it nonetheless and wanted to point it out as a
bad component API design. I'd personally prefer to use something like this:

```jsx {hl_lines=[2,"6-11"]}
<Modal title='Title'>
  <form id="my-form">
    <input id="name" name="name" type="text">
  </form>

  <ModalActions>
    <ModalConfirmButton form="my-form">
      Submit
    </ModalConfirmButton>
  </ModalActions>
</Modal>
```

# Don't make error messages and helper text accessible

When building forms, we often need to show error messages when the user does
something unexpected or help them understand some input better with some
description.

Here's an example in which the user must choose a username. The username may
only have alphanumeric characters and we also give it a short description
below.

{{< react path="form-with-bad-error-and-helper-text.jsx" hl_options=`hl_Lines=29-46` >}}

You'll notice we simply show the error message and helper text in a styled
`div`, which is not good because a `div` has no meaning -- a screen reader will
have no idea if what that particular text is supposed to convey, a description
or an error message. To fix this, we can use the ARIA attributes
[`aria-errormessage`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-errormessage)
and
[`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby):

{{< react path="form-with-good-error-and-helper-text.jsx" hl_options=`hl_Lines=26-28 34 44` >}}
