(function () {
    var playerReady = false;

    window.setupPlayer = function (source) {
        var video = document.querySelector("[data-player-video]");
        var overlay = document.querySelector("[data-player-overlay]");
        var hlsInstance = null;

        if (!video || !source) {
            return;
        }

        var attachSource = function () {
            if (playerReady) {
                return;
            }
            playerReady = true;

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false
                });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
            } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
            } else {
                video.src = source;
            }
        };

        var begin = function () {
            attachSource();
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
            var playRequest = video.play();
            if (playRequest && typeof playRequest.catch === "function") {
                playRequest.catch(function () {
                    if (overlay) {
                        overlay.classList.remove("is-hidden");
                    }
                });
            }
        };

        if (overlay) {
            overlay.addEventListener("click", begin);
        }

        video.addEventListener("play", function () {
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
        });

        video.addEventListener("pause", function () {
            if (video.currentTime === 0 || video.ended) {
                if (overlay) {
                    overlay.classList.remove("is-hidden");
                }
            }
        });

        video.addEventListener("click", function () {
            if (video.paused) {
                begin();
            } else {
                video.pause();
            }
        });

        window.addEventListener("beforeunload", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    };
})();
