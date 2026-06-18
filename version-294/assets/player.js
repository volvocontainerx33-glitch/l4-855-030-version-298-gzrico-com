(function () {
  window.initMoviePlayer = function (videoId, buttonId, overlayId, sourceUrl) {
    var video = document.getElementById(videoId);
    var button = document.getElementById(buttonId);
    var overlay = document.getElementById(overlayId);
    var started = false;
    var hls = null;
    var pendingPlay = false;

    if (!video || !button || !overlay || !sourceUrl) {
      return;
    }

    function runPlay() {
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {});
      }
    }

    function attachSource() {
      if (started) {
        return;
      }
      started = true;
      video.controls = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = sourceUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false
        });
        hls.loadSource(sourceUrl);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          if (pendingPlay) {
            runPlay();
          }
        });
      } else {
        video.src = sourceUrl;
      }
    }

    function start() {
      pendingPlay = true;
      attachSource();
      overlay.classList.add("is-hidden");
      runPlay();
    }

    button.addEventListener("click", function (event) {
      event.preventDefault();
      start();
    });

    overlay.addEventListener("click", function () {
      start();
    });

    video.addEventListener("click", function () {
      if (!started || video.paused) {
        start();
      } else {
        video.pause();
      }
    });

    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    });
  };
})();
