(function () {
  var toggle = document.querySelector("[data-mobile-toggle]");
  var nav = document.querySelector("[data-mobile-nav]");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  document.addEventListener("error", function (event) {
    if (event.target && event.target.tagName === "IMG") {
      event.target.classList.add("image-off");
    }
  }, true);

  var hero = document.querySelector("[data-hero]");

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === index);
      });

      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        start();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  var searchInput = document.querySelector("[data-search-input]");
  var searchPanel = document.querySelector("[data-search-panel]");
  var searchForm = searchInput ? searchInput.closest("form") : null;

  function itemMarkup(item) {
    return [
      '<a class="search-result" href="' + item.url + '">',
      '<img src="' + item.image + '" alt="' + escapeHtml(item.title) + '">',
      '<span><strong>' + escapeHtml(item.title) + '</strong><span>' + escapeHtml(item.region + ' · ' + item.year + ' · ' + item.type) + '</span></span>',
      '</a>'
    ].join("");
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"]/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;"
      }[char];
    });
  }

  if (searchInput && searchPanel) {
    searchInput.addEventListener("input", function () {
      var query = searchInput.value.trim().toLowerCase();
      var data = window.SEARCH_ITEMS || [];

      if (!query) {
        searchPanel.classList.remove("open");
        searchPanel.innerHTML = "";
        return;
      }

      var results = data.filter(function (item) {
        return item.text.indexOf(query) !== -1;
      }).slice(0, 10);

      searchPanel.innerHTML = results.length
        ? results.map(itemMarkup).join("")
        : '<div class="search-result"><span><strong>没有找到匹配影片</strong><span>换一个关键词继续搜索</span></span></div>';
      searchPanel.classList.add("open");
    });

    document.addEventListener("click", function (event) {
      if (!searchPanel.contains(event.target) && event.target !== searchInput) {
        searchPanel.classList.remove("open");
      }
    });

    if (searchForm) {
      searchForm.addEventListener("submit", function (event) {
        var query = searchInput.value.trim();

        if (!query) {
          event.preventDefault();
        }
      });
    }
  }

  var params = new URLSearchParams(window.location.search);
  var libraryQuery = (params.get("q") || "").trim().toLowerCase();

  if (libraryQuery) {
    var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card[data-title]"));
    var count = 0;

    cards.forEach(function (card) {
      var text = [card.getAttribute("data-title"), card.getAttribute("data-meta")].join(" ").toLowerCase();
      var visible = text.indexOf(libraryQuery) !== -1;
      card.style.display = visible ? "" : "none";
      if (visible) {
        count += 1;
      }
    });

    var label = document.querySelector("[data-library-count]");
    if (label) {
      label.textContent = "搜索结果：" + count + " 部影片";
    }
  }
})();
