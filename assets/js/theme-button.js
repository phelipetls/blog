const button = document.querySelector("button.theme");

const theme = localStorage.getItem("__theme");
if (theme) {
  button.textContent = theme === "dark" ? "Light" : "Dark";
}

button.addEventListener("click", function() {
  if (document.body.dataset.theme === "dark") {
    window.__setTheme("light");
    return;
  }
  window.__setTheme("dark");
});

document.body.addEventListener("themeChange", function(e) {
  button.textContent = e.detail.theme === "dark" ? "Light" : "Dark";
});
