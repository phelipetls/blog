const crypto = require("crypto");
const blurhash = require("blurhash");
const fetch = require("node-fetch");
const sharp = require("sharp");
const fs = require("fs");
const spawn = require("cross-spawn");
const hugoConfig = require("../config.json");

const SIZE = 200;

const email = hugoConfig.params.email;
const md5Email = crypto.createHash("md5").update(email).digest("hex");
const gravatarUrl = "https://www.gravatar.com/avatar/" + md5Email + "?s=" + SIZE;

const downloadImageAndEncodeWithBlurhash = (url) => {
  return fetch(url)
    .then((res) => res.buffer())
    .then((buffer) => sharp(buffer).raw().toBuffer({ resolveWithObject: true }))
    .then(({ data, info }) =>
      blurhash.encode(
        new Uint8ClampedArray(data),
        info.width,
        info.height,
        4,
        4
      )
    );
};

downloadImageAndEncodeWithBlurhash(gravatarUrl)
  .then((newBlurhash) => {
    const output = "assets/blurhash-gravatar.txt";
    const oldBlurhash = fs.readFileSync(output, { encoding: "utf-8" });

    if (oldBlurhash !== newBlurhash) {
      fs.writeFileSync(output, newBlurhash);

      spawn("git", ["reset", "-q", "--mixed"], { stdio: "inherit" });
      spawn("git", ["add", output], { stdio: "inherit" });
      spawn(
        "git",
        ["commit", "--no-status", "-m", "Update Gravatar Blurhash"],
        { stdio: "inherit" }
      );
    }
  })
  .catch((err) => {
    console.error(`Error while trying to generate blurhash: ${err.message}`);
  });
