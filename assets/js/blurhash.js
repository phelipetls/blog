import { decode } from 'blurhash'

const canvas = document.getElementById('gravatar-blurhash')
const ctx = canvas.getContext('2d')

const pixels = decode(canvas.dataset.blurhash, canvas.width, canvas.height)

const imageData = ctx.createImageData(canvas.width, canvas.height)
imageData.data.set(pixels)
ctx.putImageData(imageData, 0, 0)
