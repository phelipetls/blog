const button = document.querySelector("button.theme");

function setTheme(theme) {
  document.body.setAttribute("data-theme", theme);
  localStorage.setItem("__theme", theme);
  button.textContent = theme === "dark" ? "Light" : "Dark";
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
