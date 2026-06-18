(function () {
    function ready(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function setupMenu() {
        var button = document.querySelector("[data-menu-toggle]");
        var nav = document.querySelector("[data-mobile-nav]");
        if (!button || !nav) {
            return;
        }
        button.addEventListener("click", function () {
            nav.classList.toggle("open");
        });
    }

    function setupFilters() {
        var scopes = document.querySelectorAll("[data-filter-scope]");
        scopes.forEach(function (scope) {
            var keyword = scope.querySelector("[data-filter-keyword]");
            var region = scope.querySelector("[data-filter-region]");
            var type = scope.querySelector("[data-filter-type]");
            var year = scope.querySelector("[data-filter-year]");
            var empty = scope.querySelector("[data-filter-empty]");
            var container = scope.parentElement;
            if (!container) {
                return;
            }
            var items = Array.prototype.slice.call(container.querySelectorAll(".filter-item"));
            var apply = function () {
                var q = normalize(keyword && keyword.value);
                var r = normalize(region && region.value);
                var t = normalize(type && type.value);
                var y = normalize(year && year.value);
                var shown = 0;
                items.forEach(function (item) {
                    var haystack = normalize([
                        item.getAttribute("data-title"),
                        item.getAttribute("data-region"),
                        item.getAttribute("data-type"),
                        item.getAttribute("data-year"),
                        item.getAttribute("data-genre"),
                        item.getAttribute("data-tags")
                    ].join(" "));
                    var ok = true;
                    if (q && haystack.indexOf(q) === -1) {
                        ok = false;
                    }
                    if (r && normalize(item.getAttribute("data-region")) !== r) {
                        ok = false;
                    }
                    if (t && normalize(item.getAttribute("data-type")) !== t) {
                        ok = false;
                    }
                    if (y && normalize(item.getAttribute("data-year")) !== y) {
                        ok = false;
                    }
                    item.classList.toggle("hidden", !ok);
                    if (ok) {
                        shown += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle("show", shown === 0);
                }
            };
            [keyword, region, type, year].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", apply);
                    control.addEventListener("change", apply);
                }
            });
        });
    }

    function softenMissingImages() {
        var images = document.querySelectorAll("img");
        images.forEach(function (img) {
            img.addEventListener("error", function () {
                img.style.opacity = "0";
            });
        });
    }

    ready(function () {
        setupMenu();
        setupFilters();
        softenMissingImages();
    });
})();
