import { decode } from "blurhash";

const width = Number("{{ .Size }}");
const height = Number("{{ .Size }}");

const pixels = decode("{{ .Blurhash }}", width, height);

const canvas = document.getElementById("gravatar-blurhash");
const ctx = canvas.getContext("2d");
const imageData = ctx.createImageData(width, height);
imageData.data.set(pixels);
ctx.putImageData(imageData, 0, 0);
