let currentUrl = location.href;

function injectDownloadButton() {
  if (document.getElementById("yt-shorts-download-btn")) return;

  const btn = document.createElement("button");
  btn.id = "yt-shorts-download-btn";
  btn.innerText = "⬇ Download Shorts";
  btn.style.position = "fixed";
  btn.style.top = "80px";
  btn.style.right = "20px";
  btn.style.zIndex = "9999";
  btn.style.padding = "10px";
  btn.style.background = "#FF0000";
  btn.style.color = "white";
  btn.style.border = "none";
  btn.style.borderRadius = "5px";
  btn.style.cursor = "pointer";

  btn.addEventListener("click", () => {
    const videoUrl = window.location.href;
    const apiUrl = `http://localhost:3000/download?url=${encodeURIComponent(videoUrl)}`;
    window.open(apiUrl, "_blank");
  });

  document.body.appendChild(btn);
}

function removeDownloadButton() {
  const btn = document.getElementById("yt-shorts-download-btn");
  if (btn) btn.remove();
}

function handleRouteChange() {
  const isShorts = location.href.includes("/shorts/");
  if (isShorts) {
    waitForShortsContainer().then(injectDownloadButton);
  } else {
    removeDownloadButton();
  }
}

// Wait until the shorts container is in the DOM
function waitForShortsContainer() {
  return new Promise((resolve) => {
    const checkExist = setInterval(() => {
      const shortsElement = document.querySelector("ytd-reel-video-renderer");
      if (shortsElement) {
        clearInterval(checkExist);
        resolve();
      }
    }, 300);
  });
}

// Poll for route changes
setInterval(() => {
  if (location.href !== currentUrl) {
    currentUrl = location.href;
    handleRouteChange();
  }
}, 500);

// Initial trigger
handleRouteChange();
