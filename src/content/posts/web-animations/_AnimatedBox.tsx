import Sandpack from '@components/Sandpack'

type AnimatedBoxProps = {
  withForwards?: boolean
}

export default function AnimatedBox({
  withForwards = true,
  ...rest
}: AnimatedBoxProps) {
  return (
    <Sandpack
      template='static'
      {...rest}
      title='Animating a box moving forward'
      files={{
        '/index.html': `<!DOCTYPE html>
<html>
  <style>
    .box {
      background-color: black;
      width: 20px;
      aspect-ratio: 1 / 1;
    }

    @keyframes box-animation {
      to {
        transform: translateX(100px);
      }
    }

    .animated-box {
      animation: box-animation 1s linear${withForwards ? ' forwards' : ''};
    }
  </style>

  <body>
    <div class="box animated-box"></div>
  </body>
</html>`,
      }}
    />
  )
}
