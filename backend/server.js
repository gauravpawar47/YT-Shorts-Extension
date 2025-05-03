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

  if (!videoURL) {
    return res.status(400).send("Missing video URL");
  }

  // Get the title first using yt-dlp
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
    const outputPath = path.join(__dirname, `${title}.mp4`);

    // Format selector based on quality
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
        formatSelector = "bv*[vcodec^=avc1]+ba[ext=m4a]"; // Best available
        break;
    }

    const downloadCommand = `yt-dlp -f "${formatSelector}" --merge-output-format mp4 -o "${outputPath}" ${videoURL}`;

    exec(
      downloadCommand,
      { cwd: path.resolve(__dirname) },
      (error, stdout, stderr) => {
        if (error) {
          console.error("Download error:", stderr);
          return res.status(500).send("Failed to download video");
        }

        if (!fs.existsSync(outputPath)) {
          return res.status(404).send("Downloaded file not found");
        }

        res.download(outputPath, `${title}.mp4`, (err) => {
          if (err) {
            console.error("Error sending file:", err);
            res.status(500).send("Failed to send video");
          }

          // Delete the file after sending
          fs.unlink(outputPath, (unlinkErr) => {
            if (unlinkErr)
              console.warn("Failed to delete file:", unlinkErr.message);
            else console.log(`Deleted: ${outputPath}`);
          });
        });
      }
    );
  });
});

app.get("/", (req, res) => {
  res.send("Server is Running, Now Start Downloading Shorts !!");
});

app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});
