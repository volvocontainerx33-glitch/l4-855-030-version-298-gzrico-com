import { H as Hls } from "./hls-vendor-dru42stk.js";

function setupPlayer(video) {
  var url = video.getAttribute("data-hls");
  var shell = video.closest(".video-shell");
  var button = shell ? shell.querySelector(".player-start") : null;
  var status = shell ? shell.parentElement.querySelector("[data-player-status]") : null;

  if (!url) {
    if (status) {
      status.textContent = "播放源加载失败，请刷新页面重试。";
    }
    return;
  }

  if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = url;
  } else if (Hls.isSupported()) {
    var hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 90
    });

    hls.loadSource(url);
    hls.attachMedia(video);

    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      if (status) {
        status.textContent = "影片已就绪，点击播放按钮开始观看。";
      }
    });

    hls.on(Hls.Events.ERROR, function (eventName, data) {
      if (data && data.fatal && status) {
        status.textContent = "播放加载遇到问题，请稍后重试。";
      }
    });
  } else if (status) {
    status.textContent = "播放加载遇到问题，请更换浏览器重试。";
  }

  if (button) {
    button.addEventListener("click", function () {
      var playPromise = video.play();

      if (playPromise && typeof playPromise.then === "function") {
        playPromise.then(function () {
          shell.classList.add("playing");
        }).catch(function () {
          shell.classList.remove("playing");
        });
      } else {
        shell.classList.add("playing");
      }
    });
  }

  video.addEventListener("play", function () {
    if (shell) {
      shell.classList.add("playing");
    }
  });

  video.addEventListener("pause", function () {
    if (shell && video.currentTime === 0) {
      shell.classList.remove("playing");
    }
  });
}

Array.prototype.slice.call(document.querySelectorAll(".js-hls-player")).forEach(setupPlayer);
