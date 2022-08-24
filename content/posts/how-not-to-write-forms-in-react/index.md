---
title: How not to write forms with React
date: 2022-08-21
tags: [javascript, react]
---

I think forms are easy to get wrong because their goal is to make a network
request, and we can do that with any arbitrary HTML and JavaScript.

People often learn React with a strong focus on JavaScript -- HTML and CSS
being second-class citizens --, so my guess is we're more likely to write
unidiomatic HTML at the beginning.

Let's look at some examples of bad forms and how to improve them.

# Don't use the `form` HTML element

`form` is an ancient HTML element used to send data to a server, and it doesn't
need JavaScript at all to do its job: you can configure the network request
with HTML attributes, `method` and `action`. But we never use it because we're
building SPA and want to make the request in the background, whereas a plain
HTML form will navigate to a new page after submitted.

Nevertheless, it's still important to use the `form` element, it's a part of
the web for a long time and users are used to its functionality.

To illustrate this, here's a "form" without any semantic elements:

{{< react path="bad-form.jsx" >}}

I say this is a "form" because it'll send a request with user data when you
click the submit button.

The first problem is that it's not accessible -- the inputs have no label, so
visually impaired users will have a hard time to understand what's going on.

Also the user won't be able to submit by pressing enter in the text input,
which can be frustrating. It's important to make your website behave like most
other sites, and you can do that by mostly writing idiomatic HTML and the
browser will do the rest.

Here's what I think to be more appropriate:

{{< react path="good-form.jsx" hl_options="hl_Lines=5-6 11 15-18 21" >}}

Now the form will be submitted when the user press enter and the inputs are
more accessible.

# Don't use a library to handle form state

React form libraries like Formik and react-hook-form are staples in most React
apps, but someone may still use plain `useState` to manage form state and get
away with it during code review. Using `useState` for every input in a form is
inefficient and difficult to maintain, so it's best to avoid it.

I really like react-hook-form, it gives you a object nicely maps input names to
their values in the submit handler:

{{< react path="react-hook-form.jsx" hl_options="hl_Lines=4-7 11 14 23-25" >}}

Here's the equivalent JavaScript code we'd need if we chose not to use
react-hook-form:

{{< react path="form-without-lib.jsx" hl_options="hl_Lines=2-14" >}}

This particular example might not be convincing, because it's straightforward
to get the values from text/number inputs, but the point is that a library will
abstract away from you the DOM API needed to get the value from kind of inputs,
which is mostly repetitive work.

# Don't associate the submit button with the form

When a button (or an `<input type="submit">`) is inside a `form` element, it
gets automatically associated with it, meaning it'll submit the form
automatically when you click on it (unless it has `type="button"`).

But sometimes we want to submit the form by clicking on a button outside of it,
how can to associate them? We can do this with the [`form`
attribute](https://www.w3schools.com/tags/att_form.asp).

We not always have complete control over the HTML though. For instance, I
recently saw a Modal component, and I wanted to submit the form with its
"confirm" button, but I couldn't arbitrarily customize it, just its text and
onClick handler, so there was no way to pass the `form` attribute to it:

```jsx
<Modal
  title='Title'
  confirmBtnTitle='Submit'
  onConfirmBtnClick={formik.submitForm}
>
  <form>
    <input id="name" name="name" type="text">
  </form>
</Modal>
```

Of course, being able to customize the `onClick` handler is enough to submit
the form, so this is kind of a nitpick, but I wanted to point this out anyway
because as bad component API design. A better approach would be something like
this:

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
something unexpected or help them understand some input better with helper
texts.

Here's a silly example to illustrate how to not do this -- a username input
that only accepts alphanumeric characters, there is both a helper text to
explain this and an error message in case the user do this anyway:

{{< react path="form-with-bad-error-and-helper-text.jsx" hl_options="hl_Lines=29-46" >}}

This is bad because using a `div` has no meaning, so a screen reader will have
no idea if a particular text is supposed to help or show an error. To fix this,
we can use
[`aria-errormessage`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-errormessage)
and
[`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby)
attributes:

{{< react path="form-with-good-error-and-helper-text.jsx" hl_options="hl_Lines=23-25 34 44" >}}
