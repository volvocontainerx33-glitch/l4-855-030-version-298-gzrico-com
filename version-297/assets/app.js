(function () {
    var mobileButton = document.querySelector("[data-mobile-toggle]");
    var mobilePanel = document.querySelector("[data-mobile-panel]");

    if (mobileButton && mobilePanel) {
        mobileButton.addEventListener("click", function () {
            mobilePanel.classList.toggle("is-open");
        });
    }

    document.querySelectorAll("[data-site-search]").forEach(function (form) {
        form.addEventListener("submit", function (event) {
            var input = form.querySelector("input[name='q']");
            if (!input || !input.value.trim()) {
                return;
            }
            event.preventDefault();
            var action = form.getAttribute("action") || "library.html";
            window.location.href = action + "?q=" + encodeURIComponent(input.value.trim());
        });
    });

    var hero = document.querySelector("[data-hero]");
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var current = 0;
        var timer = null;

        var show = function (index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        };

        var start = function () {
            clearInterval(timer);
            timer = setInterval(function () {
                show(current + 1);
            }, 5200);
        };

        if (prev) {
            prev.addEventListener("click", function () {
                show(current - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(current + 1);
                start();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                start();
            });
        });

        start();
    }

    var filterPanel = document.querySelector("[data-filter-panel]");
    if (filterPanel) {
        var input = filterPanel.querySelector("[data-card-filter]");
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
        var buttons = Array.prototype.slice.call(filterPanel.querySelectorAll("[data-filter-category]"));
        var clearButton = filterPanel.querySelector("[data-clear-filter]");
        var empty = filterPanel.querySelector("[data-no-results]");
        var selectedCategory = "all";

        var params = new URLSearchParams(window.location.search);
        var initial = params.get("q") || "";
        if (input && initial) {
            input.value = initial;
        }

        var apply = function () {
            var query = input ? input.value.trim().toLowerCase() : "";
            var visible = 0;

            cards.forEach(function (card) {
                var text = (card.getAttribute("data-search") || "").toLowerCase();
                var category = card.getAttribute("data-category") || "";
                var matchQuery = !query || text.indexOf(query) !== -1;
                var matchCategory = selectedCategory === "all" || category === selectedCategory;
                var showCard = matchQuery && matchCategory;

                card.classList.toggle("is-hidden", !showCard);
                if (showCard) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle("is-visible", visible === 0);
            }
        };

        if (input) {
            input.addEventListener("input", apply);
        }

        buttons.forEach(function (button) {
            button.addEventListener("click", function () {
                selectedCategory = button.getAttribute("data-filter-category") || "all";
                buttons.forEach(function (item) {
                    item.classList.toggle("is-active", item === button);
                });
                apply();
            });
        });

        if (clearButton) {
            clearButton.addEventListener("click", function () {
                if (input) {
                    input.value = "";
                }
                selectedCategory = "all";
                buttons.forEach(function (button) {
                    button.classList.toggle("is-active", button.getAttribute("data-filter-category") === "all");
                });
                apply();
            });
        }

        apply();
    }
})();
