function setupMobileNavigation() {
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-mobile-nav]');

  if (!toggle || !menu) {
    return;
  }

  toggle.addEventListener('click', () => {
    menu.classList.toggle('is-open');
  });
}

function setupHeroCarousel() {
  const root = document.querySelector('[data-hero]');

  if (!root) {
    return;
  }

  const slides = Array.from(root.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(root.querySelectorAll('[data-hero-dot]'));
  const previous = root.querySelector('[data-hero-prev]');
  const next = root.querySelector('[data-hero-next]');
  let index = 0;
  let timer = null;

  function showSlide(nextIndex) {
    if (slides.length === 0) {
      return;
    }

    index = (nextIndex + slides.length) % slides.length;

    slides.forEach((slide, currentIndex) => {
      slide.classList.toggle('is-active', currentIndex === index);
    });

    dots.forEach((dot, currentIndex) => {
      dot.classList.toggle('is-active', currentIndex === index);
      dot.setAttribute('aria-current', currentIndex === index ? 'true' : 'false');
    });
  }

  function restartTimer() {
    if (timer) {
      window.clearInterval(timer);
    }

    timer = window.setInterval(() => {
      showSlide(index + 1);
    }, 5200);
  }

  previous?.addEventListener('click', () => {
    showSlide(index - 1);
    restartTimer();
  });

  next?.addEventListener('click', () => {
    showSlide(index + 1);
    restartTimer();
  });

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener('click', () => {
      showSlide(dotIndex);
      restartTimer();
    });
  });

  showSlide(0);
  restartTimer();
}

function setupLocalFilters() {
  const inputs = Array.from(document.querySelectorAll('[data-filter-input]'));

  inputs.forEach((input) => {
    const scopeSelector = input.getAttribute('data-filter-scope');
    const scope = scopeSelector ? document.querySelector(scopeSelector) : document;
    const cards = Array.from(scope.querySelectorAll('[data-filter-card]'));
    const countNode = document.querySelector(input.getAttribute('data-filter-count') || '');

    function applyFilter() {
      const query = input.value.trim().toLowerCase();
      let visibleCount = 0;

      cards.forEach((card) => {
        const text = (card.getAttribute('data-title') || '').toLowerCase();
        const isVisible = !query || text.includes(query);
        card.classList.toggle('is-hidden', !isVisible);

        if (isVisible) {
          visibleCount += 1;
        }
      });

      if (countNode) {
        countNode.textContent = `${visibleCount} 部影片`;
      }
    }

    input.addEventListener('input', applyFilter);
    applyFilter();
  });
}

async function prepareHlsVideo(video) {
  const source = video.getAttribute('data-src');

  if (!source || video.dataset.ready === 'true') {
    return;
  }

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = source;
    video.dataset.ready = 'true';
    return;
  }

  try {
    const module = await import('./hls-dru42stk.js');
    const Hls = module.H;

    if (Hls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false
      });

      hls.loadSource(source);
      hls.attachMedia(video);
      window.__movieHlsInstances = window.__movieHlsInstances || [];
      window.__movieHlsInstances.push(hls);
      video.dataset.ready = 'true';
      return;
    }
  } catch (error) {
    console.error('HLS 初始化失败，尝试使用原生播放。', error);
  }

  video.src = source;
  video.dataset.ready = 'true';
}

function setupPlayers() {
  const wrappers = Array.from(document.querySelectorAll('[data-player-wrap]'));

  wrappers.forEach((wrapper) => {
    const video = wrapper.querySelector('video[data-src]');
    const playButton = wrapper.querySelector('[data-player-play]');

    if (!video) {
      return;
    }

    async function startPlayback() {
      await prepareHlsVideo(video);
      wrapper.classList.add('is-playing');

      try {
        await video.play();
      } catch (error) {
        console.warn('浏览器阻止了自动播放，请再次点击播放器。', error);
      }
    }

    playButton?.addEventListener('click', startPlayback);

    video.addEventListener('play', () => {
      wrapper.classList.add('is-playing');
    });

    video.addEventListener('pause', () => {
      if (video.currentTime === 0 || video.ended) {
        wrapper.classList.remove('is-playing');
      }
    });
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function setupSearchPage() {
  const resultsRoot = document.querySelector('[data-search-results]');
  const input = document.querySelector('[data-search-page-input]');
  const form = document.querySelector('[data-search-page-form]');

  if (!resultsRoot || !window.MOVIE_SEARCH_DATA) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get('q') || '';

  if (input) {
    input.value = initialQuery;
  }

  function render(query) {
    const normalized = query.trim().toLowerCase();
    const dataset = window.MOVIE_SEARCH_DATA;
    const matched = normalized
      ? dataset.filter((item) => item.searchText.toLowerCase().includes(normalized))
      : dataset.slice(0, 48);

    if (matched.length === 0) {
      resultsRoot.innerHTML = '<div class="search-empty">没有找到匹配影片，请尝试更换关键词。</div>';
      return;
    }

    const html = matched.slice(0, 240).map((item) => `
      <article class="movie-card">
        <a class="card-cover" href="${escapeHtml(item.url)}">
          <img src="${escapeHtml(item.cover)}" alt="${escapeHtml(item.title)}" loading="lazy">
          <span class="play-float">▶</span>
          <span class="card-category">${escapeHtml(item.category)}</span>
        </a>
        <div class="card-body">
          <h3><a href="${escapeHtml(item.url)}">${escapeHtml(item.title)}</a></h3>
          <p>${escapeHtml(item.oneLine)}</p>
          <div class="card-meta">
            <span>${escapeHtml(item.region)}</span>
            <span>${escapeHtml(item.year)}</span>
            <span>${escapeHtml(item.genre)}</span>
          </div>
        </div>
      </article>
    `).join('');

    resultsRoot.innerHTML = html;
  }

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = input?.value || '';
    const url = new URL(window.location.href);
    url.searchParams.set('q', query);
    window.history.replaceState({}, '', url);
    render(query);
  });

  render(initialQuery);
}

setupMobileNavigation();
setupHeroCarousel();
setupLocalFilters();
setupPlayers();
setupSearchPage();
