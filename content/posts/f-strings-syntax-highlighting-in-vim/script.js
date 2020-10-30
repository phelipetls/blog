const before = document.querySelector("[alt='Before']");
const after = document.querySelector("[alt='After']");

const cocoen = document.createElement("div");
cocoen.className = "cocoen";

after.after(cocoen)
cocoen.append(after, before)

new Cocoen(cocoen);
