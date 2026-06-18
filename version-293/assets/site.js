(function () {
    function qs(selector, root) {
        return (root || document).querySelector(selector);
    }

    function qsa(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    var menuButton = qs('.menu-toggle');
    var mobilePanel = qs('.mobile-panel');
    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            var open = mobilePanel.classList.toggle('open');
            menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    qsa('.js-site-search').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            var input = form.querySelector('input[name="q"]');
            if (!input || !input.value.trim()) {
                event.preventDefault();
                return;
            }
            event.preventDefault();
            window.location.href = './search.html?q=' + encodeURIComponent(input.value.trim());
        });
    });

    var carousel = qs('[data-carousel]');
    if (carousel) {
        var slides = qsa('.hero-slide', carousel);
        var dots = qsa('.hero-dot', carousel);
        var current = 0;
        var timer;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        }

        function start() {
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                window.clearInterval(timer);
                showSlide(Number(dot.getAttribute('data-slide') || 0));
                start();
            });
        });

        showSlide(0);
        start();
    }

    var filterPanel = qs('[data-filter-panel]');
    if (filterPanel) {
        var textInput = qs('[data-filter-text]', filterPanel);
        var yearSelect = qs('[data-filter-year]', filterPanel);
        var regionButtons = qsa('[data-filter-region]', filterPanel);
        var cards = qsa('[data-filter-list] .movie-card');
        var activeRegion = '';

        function applyFilter() {
            var keyword = textInput ? textInput.value.trim().toLowerCase() : '';
            var year = yearSelect ? yearSelect.value : '';
            cards.forEach(function (card) {
                var title = (card.getAttribute('data-title') || '').toLowerCase();
                var genre = (card.getAttribute('data-genre') || '').toLowerCase();
                var region = card.getAttribute('data-region') || '';
                var cardYear = card.getAttribute('data-year') || '';
                var matchText = !keyword || title.indexOf(keyword) > -1 || genre.indexOf(keyword) > -1 || region.toLowerCase().indexOf(keyword) > -1;
                var matchYear = !year || cardYear === year;
                var matchRegion = !activeRegion || region === activeRegion;
                card.style.display = matchText && matchYear && matchRegion ? '' : 'none';
            });
        }

        if (textInput) {
            textInput.addEventListener('input', applyFilter);
        }
        if (yearSelect) {
            yearSelect.addEventListener('change', applyFilter);
        }
        regionButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                regionButtons.forEach(function (item) {
                    item.classList.remove('active');
                });
                button.classList.add('active');
                activeRegion = button.getAttribute('data-filter-region') || '';
                applyFilter();
            });
        });
    }
}());
