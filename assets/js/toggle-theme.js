const themeButton = document.querySelector("#theme-button");
const svgIcon = document.querySelector("#theme-button-svg-icon");

const toggleSvgIcon = function(theme) {
  const icon = theme === "dark" ? "#sun" : "#moon";
  svgIcon.setAttribute("href", icon);
}

const theme = localStorage.getItem("__theme");

if (theme) {
  toggleSvgIcon(theme);
}

themeButton.addEventListener("click", function() {
  const newTheme = document.body.dataset.theme === "dark" ? "light" : "dark";

  window.__setTheme(newTheme);
  toggleSvgIcon(newTheme);
});
