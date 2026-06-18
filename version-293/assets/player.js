(function () {
    window.initMoviePlayer = function (options) {
        var video = document.getElementById(options.videoId);
        var overlay = document.getElementById(options.overlayId);
        var streamUrl = options.streamUrl;
        var hlsInstance = null;
        var initialized = false;

        function attachStream() {
            if (initialized) {
                return;
            }
            initialized = true;
            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false
                });
                hlsInstance.loadSource(streamUrl);
                hlsInstance.attachMedia(video);
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
            } else {
                video.src = streamUrl;
            }
        }

        function startPlayback() {
            attachStream();
            if (overlay) {
                overlay.classList.add('hide');
            }
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {});
            }
        }

        if (!video) {
            return;
        }

        if (overlay) {
            overlay.addEventListener('click', startPlayback);
        }

        video.addEventListener('click', function () {
            if (video.paused) {
                startPlayback();
            }
        });

        video.addEventListener('play', function () {
            if (overlay) {
                overlay.classList.add('hide');
            }
        });

        window.addEventListener('pagehide', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
                hlsInstance = null;
            }
        });
    };
}());
