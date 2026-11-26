/*
  Phone top bar: show "Go ↑" only once the visitor has scrolled far enough
  for going back to the top to be useful (half a screen). Without JavaScript
  the link simply stays visible.
*/
(function () {
  var go = document.querySelector(".mobile-top");
  if (!go) return;
  var bar = go.closest(".mobile-bar");

  function update() {
    bar.classList.toggle("show-go", window.scrollY > window.innerHeight * 0.5);
  }

  bar.classList.add("go-auto");
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
})();
