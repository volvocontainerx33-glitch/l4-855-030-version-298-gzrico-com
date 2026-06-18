(function () {
    var movies = window.SEARCH_MOVIES || [];
    var form = document.getElementById('searchPageForm');
    var input = document.getElementById('searchInput');
    var regionFilter = document.getElementById('regionFilter');
    var typeFilter = document.getElementById('typeFilter');
    var yearFilter = document.getElementById('yearFilter');
    var results = document.getElementById('searchResults');

    function params() {
        return new URLSearchParams(window.location.search);
    }

    function unique(field) {
        var seen = {};
        movies.forEach(function (movie) {
            if (movie[field]) {
                seen[movie[field]] = true;
            }
        });
        return Object.keys(seen).sort().reverse();
    }

    function fillSelect(select, values) {
        if (!select) {
            return;
        }
        values.forEach(function (value) {
            var option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            select.appendChild(option);
        });
    }

    function movieCard(movie) {
        var tags = (movie.tags || []).slice(0, 4).map(function (tag) {
            return '<span>' + escapeHtml(tag) + '</span>';
        }).join('');
        return '<article class="movie-card">' +
            '<a class="poster-link" href="./' + escapeHtml(movie.url) + '">' +
            '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
            '<span class="poster-shade"></span><span class="play-chip">播放</span></a>' +
            '<div class="movie-body"><div class="movie-meta"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.type) + '</span></div>' +
            '<h2><a href="./' + escapeHtml(movie.url) + '">' + escapeHtml(movie.title) + '</a></h2>' +
            '<p>' + escapeHtml(movie.oneLine || '') + '</p>' +
            '<div class="tag-row">' + tags + '</div></div></article>';
    }

    function escapeHtml(value) {
        return String(value || '').replace(/[&<>'"]/g, function (char) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[char];
        });
    }

    function render() {
        if (!results) {
            return;
        }
        var keyword = input ? input.value.trim().toLowerCase() : '';
        var region = regionFilter ? regionFilter.value : '';
        var type = typeFilter ? typeFilter.value : '';
        var year = yearFilter ? yearFilter.value : '';
        var filtered = movies.filter(function (movie) {
            var searchText = [movie.title, movie.region, movie.type, movie.year, movie.genre, movie.oneLine].concat(movie.tags || []).join(' ').toLowerCase();
            return (!keyword || searchText.indexOf(keyword) > -1) &&
                (!region || movie.region === region) &&
                (!type || movie.type === type) &&
                (!year || movie.year === year);
        }).slice(0, 96);
        results.innerHTML = filtered.map(movieCard).join('');
    }

    fillSelect(regionFilter, unique('region'));
    fillSelect(typeFilter, unique('type'));
    fillSelect(yearFilter, unique('year'));

    var query = params().get('q') || '';
    if (input) {
        input.value = query;
        input.addEventListener('input', render);
    }
    [regionFilter, typeFilter, yearFilter].forEach(function (select) {
        if (select) {
            select.addEventListener('change', render);
        }
    });
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var url = './search.html';
            if (input && input.value.trim()) {
                url += '?q=' + encodeURIComponent(input.value.trim());
            }
            window.history.replaceState(null, '', url);
            render();
        });
    }
    render();
}());
