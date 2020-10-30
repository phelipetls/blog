const before = document.querySelector("[alt='Before']");
const after = document.querySelector("[alt='After']");

const container = document.createElement("div");
container.className = "cocoen";

after.after(container);
container.append(after, before);

new Cocoen(container);
