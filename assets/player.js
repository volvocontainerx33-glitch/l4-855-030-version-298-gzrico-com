(function () {
  window.initMoviePlayer = function (source) {
    var box = document.querySelector(".player-box");
    var video = document.querySelector(".movie-video");
    var overlay = document.querySelector(".player-overlay");
    var started = false;
    var hls = null;

    if (!box || !video || !source) return;

    function playVideo() {
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {});
      }
    }

    function attachSource() {
      if (started) {
        playVideo();
        return;
      }
      started = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
        video.addEventListener("loadedmetadata", playVideo, { once: true });
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, playVideo);
      } else {
        video.src = source;
        video.addEventListener("loadedmetadata", playVideo, { once: true });
      }
    }

    function start() {
      if (overlay) overlay.classList.add("is-hidden");
      attachSource();
    }

    if (overlay) overlay.addEventListener("click", start);
    video.addEventListener("click", function () {
      if (!started) start();
    });
    window.addEventListener("pagehide", function () {
      if (hls) hls.destroy();
    });
  };
})();
