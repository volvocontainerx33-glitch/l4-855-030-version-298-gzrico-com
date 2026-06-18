(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function textOf(card) {
    return (card.textContent || "").replace(/\s+/g, " ").toLowerCase();
  }

  function filterCards(input, root) {
    var query = (input || "").trim().toLowerCase();
    var scope = root || document;
    var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-card]"));
    var count = 0;
    cards.forEach(function (card) {
      var matched = !query || textOf(card).indexOf(query) !== -1;
      card.classList.toggle("is-hidden", !matched);
      if (matched) {
        count += 1;
      }
    });
    var countNode = scope.querySelector("[data-search-count]") || document.querySelector("[data-search-count]");
    if (countNode) {
      countNode.textContent = query ? "找到 " + count + " 部相关内容" : "";
    }
  }

  ready(function () {
    var toggle = document.querySelector("[data-mobile-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (toggle && panel) {
      toggle.addEventListener("click", function () {
        panel.classList.toggle("open");
      });
    }

    Array.prototype.slice.call(document.querySelectorAll("[data-search-form]")).forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = form.querySelector("input[type='search']");
        var query = input ? input.value.trim() : "";
        if (query) {
          window.location.href = "./search.html?q=" + encodeURIComponent(query);
        } else {
          window.location.href = "./search.html";
        }
      });
    });

    Array.prototype.slice.call(document.querySelectorAll("[data-local-filter]")).forEach(function (input) {
      var section = input.closest("section") || document;
      input.addEventListener("input", function () {
        filterCards(input.value, section);
      });
    });

    var searchInput = document.querySelector("[data-search-page-input]");
    if (searchInput) {
      var params = new URLSearchParams(window.location.search);
      var query = params.get("q") || "";
      searchInput.value = query;
      filterCards(query, document);
      searchInput.addEventListener("input", function () {
        filterCards(searchInput.value, document);
      });
    }

    var slider = document.querySelector("[data-hero-slider]");
    if (slider) {
      var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
      var current = 0;
      var timer = null;

      function show(index) {
        if (!slides.length) {
          return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle("is-active", i === current);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle("active", i === current);
        });
      }

      function restart() {
        if (timer) {
          window.clearInterval(timer);
        }
        timer = window.setInterval(function () {
          show(current + 1);
        }, 5000);
      }

      var prev = slider.querySelector("[data-hero-prev]");
      var next = slider.querySelector("[data-hero-next]");
      if (prev) {
        prev.addEventListener("click", function () {
          show(current - 1);
          restart();
        });
      }
      if (next) {
        next.addEventListener("click", function () {
          show(current + 1);
          restart();
        });
      }
      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          show(Number(dot.getAttribute("data-hero-dot")) || 0);
          restart();
        });
      });
      show(0);
      restart();
    }
  });
})();
