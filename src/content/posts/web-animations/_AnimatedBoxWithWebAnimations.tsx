import Sandpack from '@components/Sandpack'

export default function AnimatedBoxWithWebAnimations() {
  return (
    <Sandpack
      template='static'
      title='Animating a box moving forward (with Web Animations API)'
      files={{
        '/index.html': `<!DOCTYPE html>
<html>
  <style>
    .box {
      background-color: black;
      width: 20px;
      aspect-ratio: 1 / 1;
    }
  </style>

  <body>
    <div class="box"></div>
  </body>

  <script>
    const box = document.querySelector('.box')

    box.animate([
      {
        transform: 'translateX(100px)',
      }
    ], {
      fill: 'forwards',
      duration: 1000,
    })
  </script>
</html>`,
      }}
    />
  )
}
