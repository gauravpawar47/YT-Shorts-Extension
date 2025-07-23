# 📥 YouTube Shorts Downloader (Extension)

A clean, fast, and hybrid solution that allows users to **download YouTube Shorts** as video or audio with a single click. It combines a **Chrome Extension frontend** with a **Node.js + yt-dlp backend** to ensure high-quality downloads and format control.

---

## 🔧 Tech Stack

### 🧩 Frontend (Chrome Extension)
- **Manifest V3** – Latest Chrome extension architecture
- **JavaScript** – Injects logic into YouTube Shorts pages
- **DOM Manipulation** – Adds custom download buttons
- **CORS** – Communicates with the local server at `localhost:3000`

### 🖥 Backend (Node.js Server)
- **Node.js + Express** – API server handling download requests
- **yt-dlp** – Core tool to download video/audio from YouTube
- **FFmpeg (via yt-dlp)** – Merges video and audio streams
- **child_process** – Executes shell commands
- **fs, path** – File handling and cleanup after download

---

## ✨ Features

- 🎯 **Auto-detects YouTube Shorts pages**
- 🔘 **Adds Download Button** with MP4 or MP3 options
- 🎞️ **Quality Selection** (1080p, 720p, 480p, best available)
- 🎧 **Audio-only download** (MP3 via yt-dlp)
- 🔃 **Temporary file cleanup** after each download
- 🧠 **Local-only, secure, and private**

---

## 🧱 Project Structure

```

yt-shorts-downloader/
│
├── extension/            # Chrome extension files
│   ├── manifest.json
│   ├── content.js
│   └── icon.png
│
├── server/               # Node.js backend
│   ├── server.js         # Express API with yt-dlp
│
└── README.md

````

---

## 🚀 Setup Instructions

### 1️⃣ Backend Setup (Node.js + yt-dlp)

1. Navigate to the `server/` directory:

```bash
cd server
````

2. Install dependencies:

```bash
npm install express cors
```

3. Ensure you have [`yt-dlp`](https://github.com/yt-dlp/yt-dlp) installed and available in PATH:

```bash
pip install yt-dlp
```

> You must also have **FFmpeg** installed (yt-dlp uses it internally).
> Download from: [https://ffmpeg.org/download.html](https://ffmpeg.org/download.html)

4. Start the server:

```bash
node server.js
```

✅ Server will run at `http://localhost:3000`

---

### 2️⃣ Frontend Setup (Chrome Extension)

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer Mode**
3. Click **Load Unpacked**
4. Select the `extension/` directory
5. Visit any Shorts URL like `https://youtube.com/shorts/xyz`
6. Click the **Download** button that appears below the video

---

## ⚙️ Permissions Summary

| Permission         | Used For                               |
| ------------------ | -------------------------------------- |
| `scripting`        | Injecting logic on Shorts pages        |
| `activeTab`        | Running code on the active YouTube tab |
| `host_permissions` | `http://localhost:3000/*` for dev API  |

---

## 📦 Dependencies

### Node.js:

* `express`
* `cors`
* `fs`, `path`
* `child_process` (built-in)

### External Tools:

* [`yt-dlp`](https://github.com/yt-dlp/yt-dlp) – downloads and merges
* [`ffmpeg`](https://ffmpeg.org/) – required by yt-dlp

---

## 🛡️ Security & Cleanup

* 🔐 All downloads happen **locally**
* 🗑️ Files are deleted automatically after download
* 🚫 No user tracking, no 3rd-party API calls

---

## 🛠️ Author & Credits

Built with ❤️ by **Gaurav Pawar**

🔗 [Portfolio](https://gauravpawar.netlify.app)

---

## 🧠 Future Additions

* ✅ Add format dropdown in the UI
* ☁️ Optional deployment via Render or Railway
* 📱 Better mobile UX (extension popup or UI modal)
* 🧩 Auto quality detection and fallback

---