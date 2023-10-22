import Sandpack from '@components/Sandpack'

export default function _AnimatedBoxWithCssTransition() {
  return (
    <Sandpack
      template='static'
      title='Animating a box moving forward (with CSS transitions and @starting-style)'
      files={{
        '/index.html': {
          active: true,
          code: `<!DOCTYPE html>
<html>
  <style>
    .box {
      background-color: black;
      width: 20px;
      aspect-ratio: 1 / 1;
      transition: transform 1s linear;
      transform: translateX(100px);
    }

    @starting-style {
      .box {
        transform: translateX(0px);
      }
    }
  </style>

  <body>
    <div class="box"></div>
  </body>
<html>`,
        },
      }}
    />
  )
}
