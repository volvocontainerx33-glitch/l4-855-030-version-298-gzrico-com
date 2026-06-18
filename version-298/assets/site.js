(function () {
  function closestScope(element) {
    return element.closest(".section") || document;
  }

  function applyFilters(scope) {
    var search = scope.querySelector(".site-search");
    var query = search ? search.value.trim().toLowerCase() : "";
    var typeSelect = scope.querySelector('[data-filter="type"]');
    var yearSelect = scope.querySelector('[data-filter="year"]');
    var type = typeSelect ? typeSelect.value : "";
    var year = yearSelect ? yearSelect.value : "";
    var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card"));
    var shown = 0;

    cards.forEach(function (card) {
      var haystack = [
        card.dataset.title,
        card.dataset.year,
        card.dataset.region,
        card.dataset.type,
        card.dataset.genre,
        card.dataset.tags
      ].join(" ").toLowerCase();
      var matched = true;

      if (query && haystack.indexOf(query) === -1) matched = false;
      if (type && (card.dataset.type || "").indexOf(type) === -1) matched = false;
      if (year && card.dataset.year !== year) matched = false;

      card.style.display = matched ? "" : "none";
      if (matched) shown += 1;
    });

    var empty = scope.querySelector(".no-results");
    if (empty) empty.style.display = shown ? "none" : "block";
  }

  function sortGrid(select) {
    var scope = closestScope(select);
    var grid = scope.querySelector("[data-movie-grid]");
    if (!grid) return;
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));
    var mode = select.value;

    cards.sort(function (a, b) {
      if (mode === "year-desc") {
        return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
      }
      if (mode === "title-asc") {
        return (a.dataset.title || "").localeCompare(b.dataset.title || "", "zh-Hans-CN");
      }
      return 0;
    });

    cards.forEach(function (card) {
      grid.appendChild(card);
    });
    applyFilters(scope);
  }

  function initHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) return;
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    if (!slides.length) return;
    var index = 0;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
      });
    });

    window.setInterval(function () {
      show(index + 1);
    }, 5200);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var nav = document.querySelector("[data-site-nav]");
    if (menuButton && nav) {
      menuButton.addEventListener("click", function () {
        nav.classList.toggle("is-open");
      });
    }

    document.querySelectorAll(".site-search, .filter-select").forEach(function (control) {
      control.addEventListener(control.tagName === "SELECT" ? "change" : "input", function () {
        applyFilters(closestScope(control));
      });
    });

    document.querySelectorAll(".sort-select").forEach(function (select) {
      select.addEventListener("change", function () {
        sortGrid(select);
      });
    });

    initHero();
  });
})();
