(function () {
    const menuButton = document.querySelector('.mobile-toggle');
    const mobilePanel = document.querySelector('.mobile-panel');

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            mobilePanel.classList.toggle('is-open');
        });
    }

    const slides = Array.from(document.querySelectorAll('.hero-slide'));
    const dots = Array.from(document.querySelectorAll('.hero-dot'));
    let currentSlide = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        currentSlide = (index + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === currentSlide);
        });

        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('is-active', dotIndex === currentSlide);
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            showSlide(index);
        });
    });

    if (slides.length > 1) {
        window.setInterval(function () {
            showSlide(currentSlide + 1);
        }, 5800);
    }

    function normalize(value) {
        return (value || '').toString().trim().toLowerCase();
    }

    function filterCards(input, scope) {
        const keyword = normalize(input.value);
        const cards = Array.from(scope.querySelectorAll('.movie-card'));

        cards.forEach(function (card) {
            const text = normalize(card.getAttribute('data-search'));
            const matched = !keyword || text.indexOf(keyword) !== -1;
            card.classList.toggle('hidden-by-search', !matched);
        });
    }

    const pageFilter = document.querySelector('.page-filter');
    const filterScope = document.querySelector('[data-filter-scope]');

    if (pageFilter && filterScope) {
        pageFilter.addEventListener('input', function () {
            filterCards(pageFilter, filterScope);
        });
    }

    const searchInput = document.getElementById('searchPageInput');
    const searchResults = document.getElementById('searchResults');

    if (searchInput && searchResults) {
        const params = new URLSearchParams(window.location.search);
        const query = params.get('q') || '';
        searchInput.value = query;
        filterCards(searchInput, searchResults);

        searchInput.addEventListener('input', function () {
            filterCards(searchInput, searchResults);
        });
    }
})();

function initMoviePlayer(source) {
    const video = document.querySelector('.player-video');
    const overlay = document.querySelector('.play-overlay');
    let started = false;
    let hlsInstance = null;

    if (!video || !source) {
        return;
    }

    function bindSource() {
        if (started) {
            return;
        }

        started = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);
        } else {
            video.src = source;
        }
    }

    function play() {
        bindSource();

        if (overlay) {
            overlay.classList.add('is-hidden');
        }

        const request = video.play();

        if (request && typeof request.catch === 'function') {
            request.catch(function () {
                video.controls = true;
            });
        }
    }

    if (overlay) {
        overlay.addEventListener('click', play);
    }

    video.addEventListener('click', function () {
        if (!started) {
            play();
        }
    });

    video.addEventListener('play', function () {
        if (overlay) {
            overlay.classList.add('is-hidden');
        }
    });

    window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}
