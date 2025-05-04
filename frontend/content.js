let currentUrl = location.href;

function injectDownloadButton() {
  if (document.getElementById("yt-shorts-download-btn")) return;

  const container = document.createElement("div");
  container.id = "yt-shorts-download-btn";
  container.style.position = "fixed";
  container.style.top = "80px";
  container.style.right = "20px";
  container.style.zIndex = "9999";
  container.style.background = "#FF0000";
  container.style.borderRadius = "8px";
  container.style.padding = "10px";
  container.style.color = "#fff";
  container.style.fontFamily = "sans-serif";
  container.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";

  // Quality selector (only for video)
  const select = document.createElement("select");
  select.style.padding = "6px";
  select.style.borderRadius = "5px";
  select.style.border = "none";
  select.style.marginBottom = "8px";
  select.style.display = "block";
  select.style.width = "100%";

  ["best", "1080", "720", "480"].forEach((q) => {
    const option = document.createElement("option");
    option.value = q;
    option.text = `${q}p`;
    select.appendChild(option);
  });

  // Main download button
  const downloadBtn = document.createElement("button");
  downloadBtn.innerText = "🎞️ Download Shorts";
  downloadBtn.style.padding = "8px 12px";
  downloadBtn.style.color = "white";
  downloadBtn.style.background = "#000";
  downloadBtn.style.border = "none";
  downloadBtn.style.borderRadius = "5px";
  downloadBtn.style.cursor = "pointer";
  downloadBtn.style.fontWeight = "bold";
  downloadBtn.style.width = "100%";

  // Toggle switch
  const toggleWrapper = document.createElement("div");
  toggleWrapper.style.marginTop = "10px";
  toggleWrapper.style.display = "flex";
  toggleWrapper.style.alignItems = "center";
  toggleWrapper.style.justifyContent = "space-between";

  const toggleLabel = document.createElement("label");
  toggleLabel.innerText = "🎵 Audio";
  toggleLabel.style.marginRight = "10px";
  toggleLabel.style.fontSize = "14px";

  const toggle = document.createElement("input");
  toggle.type = "checkbox";
  toggle.style.transform = "scale(1.2)";
  toggle.style.cursor = "pointer";

  // Append toggle
  toggleWrapper.appendChild(toggleLabel);
  toggleWrapper.appendChild(toggle);

  // Toggle behavior
  toggle.addEventListener("change", () => {
    if (toggle.checked) {
      downloadBtn.innerText = "🎵 Download Audio";
      select.style.display = "none";
    } else {
      downloadBtn.innerText = "🎞️ Download Shorts";
      select.style.display = "block";
    }
  });

  // Button click behavior
  downloadBtn.addEventListener("click", () => {
    const videoUrl = window.location.href;
    const selectedQuality = select.value;
    const isAudio = toggle.checked;

    const apiUrl = `http://localhost:3000/download?url=${encodeURIComponent(videoUrl)}${
      isAudio ? "&type=audio" : `&quality=${selectedQuality}`
    }`;

    window.open(apiUrl, "_blank");
  });

  // Final append
  container.appendChild(select);
  container.appendChild(downloadBtn);
  container.appendChild(toggleWrapper);
  document.body.appendChild(container);
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

setInterval(() => {
  if (location.href !== currentUrl) {
    currentUrl = location.href;
    handleRouteChange();
  }
}, 500);

handleRouteChange();
