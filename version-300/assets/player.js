(function () {
    function query(selector) {
        return document.querySelector(selector);
    }

    window.setupMoviePlayer = function (streamUrl) {
        var video = query("[data-player-video]");
        var button = query("[data-player-start]");
        if (!video || !button || !streamUrl) {
            return;
        }

        var attached = false;
        var hls = null;

        function showControls() {
            video.setAttribute("controls", "controls");
            button.classList.add("is-hidden");
        }

        function playVideo() {
            showControls();
            var result = video.play();
            if (result && typeof result.catch === "function") {
                result.catch(function () {
                    button.classList.remove("is-hidden");
                });
            }
        }

        function attach() {
            if (attached) {
                playVideo();
                return;
            }
            attached = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
                playVideo();
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    playVideo();
                });
                playVideo();
                return;
            }
            video.src = streamUrl;
            playVideo();
        }

        button.addEventListener("click", attach);
        video.addEventListener("click", function () {
            if (!attached) {
                attach();
                return;
            }
            if (video.paused) {
                playVideo();
            } else {
                video.pause();
            }
        });
        window.addEventListener("beforeunload", function () {
            if (hls) {
                hls.destroy();
            }
        });
    };
})();
