const button = document.querySelector("button.theme");

function toTitleCase(str) {
  return str[0].toUpperCase() + str.slice(1);
}

function setTheme(newTheme) {
  document.body.setAttribute("data-theme", newTheme);
  localStorage.setItem("__theme", newTheme);

  const oldTheme = newTheme === "dark" ? "light" : "dark";

  document
    .querySelector("link[href*='" + oldTheme + "']")
    .setAttribute("disabled", "");

  document
    .querySelector("link[href*='" + newTheme + "']")
    .removeAttribute("disabled");

  button.textContent = toTitleCase(newTheme);
}

const storedTheme = localStorage.getItem("__theme");

if (storedTheme) {
  setTheme(storedTheme);
} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  setTheme("dark");
}

button.addEventListener("click", function() {
  if (document.body.dataset.theme === "dark") {
    setTheme("light");
    return;
  }

  setTheme("dark");
});
