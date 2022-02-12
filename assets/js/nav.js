const navContainer = document.querySelector(".nav-container");

const observer = new IntersectionObserver(
  function ([e]) {
    e.target.classList.toggle("stuck", e.intersectionRatio < 1);
  },
  { rootMargin: "-1px 0px 0px 0px", threshold: [1] }
);

observer.observe(navContainer);
