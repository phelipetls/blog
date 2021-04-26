const button = document.querySelector("button.theme");

function toTitleCase(str) {
  return str[0].toUpperCase() + str.slice(1);
}

button.addEventListener("click", function() {
  if (document.body.dataset.theme === "dark") {
    window.__setTheme("light");
    return;
  }

  window.__setTheme("dark");
});

button.addEventListener("themeChange", function(e) {
  e.target.textContent = toTitleCase(e.detail.theme);
});
