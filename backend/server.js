const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
app.use(cors());

app.get("/download", (req, res) => {
  const videoURL = req.query.url;
  const quality = req.query.quality || "best";
  const type = req.query.type || "video"; // default is video

  if (!videoURL) {
    return res.status(400).send("Missing video URL");
  }

  // Get title for filename
  const titleCommand = `yt-dlp --get-title ${videoURL}`;

  exec(titleCommand, (err, stdout, stderr) => {
    if (err) {
      console.error("Error fetching title:", stderr);
      return res.status(500).send("Failed to fetch video title");
    }

    let title = stdout
      .trim()
      .replace(/[\\/:*?"<>|]/g, "_")
      .replace(/\s+/g, "_");

    const isAudioOnly = type === "audio";
    const extension = isAudioOnly ? "mp3" : "mp4";
    const outputPath = path.join(__dirname, `${title}.${extension}`);

    // Audio-only mode
    if (isAudioOnly) {
      const audioCommand = `yt-dlp -x --audio-format mp3 -o "${outputPath}" ${videoURL}`;
      exec(audioCommand, (error, stdout, stderr) => {
        if (error) {
          console.error("Audio download error:", stderr);
          return res.status(500).send("Failed to download audio");
        }

        if (!fs.existsSync(outputPath)) {
          return res.status(404).send("Downloaded audio not found");
        }

        res.download(outputPath, `${title}.mp3`, (err) => {
          if (err) {
            console.error("Error sending audio:", err);
            res.status(500).send("Failed to send audio");
          }

          fs.unlink(outputPath, (unlinkErr) => {
            if (unlinkErr)
              console.warn("Failed to delete audio file:", unlinkErr.message);
            else console.log(`Deleted audio: ${outputPath}`);
          });
        });
      });

      return; // stop here for audio
    }

    // Video mode
    let formatSelector;
    switch (quality) {
      case "1080":
        formatSelector = "bv*[height<=1080][vcodec^=avc1]+ba[ext=m4a]";
        break;
      case "720":
        formatSelector = "bv*[height<=720][vcodec^=avc1]+ba[ext=m4a]";
        break;
      case "480":
        formatSelector = "bv*[height<=480][vcodec^=avc1]+ba[ext=m4a]";
        break;
      default:
        formatSelector = "bv*[vcodec^=avc1]+ba[ext=m4a]";
        break;
    }

    const downloadCommand = `yt-dlp -f "${formatSelector}" --merge-output-format mp4 -o "${outputPath}" ${videoURL}`;

    exec(downloadCommand, { cwd: __dirname }, (error, stdout, stderr) => {
      if (error) {
        console.error("Video download error:", stderr);
        return res.status(500).send("Failed to download video");
      }

      if (!fs.existsSync(outputPath)) {
        return res.status(404).send("Downloaded video not found");
      }

      res.download(outputPath, `${title}.mp4`, (err) => {
        if (err) {
          console.error("Error sending video:", err);
          res.status(500).send("Failed to send video");
        }

        fs.unlink(outputPath, (unlinkErr) => {
          if (unlinkErr)
            console.warn("Failed to delete video file:", unlinkErr.message);
          else console.log(`Deleted video: ${outputPath}`);
        });
      });
    });
  });
});

app.get("/", (req, res) => {
  res.send("Server is Running, Now Start Downloading Shorts !!");
});

app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});
