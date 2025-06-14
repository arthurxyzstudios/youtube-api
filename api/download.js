const ytdl = require("ytdl-core");

export default async function handler(req, res) {
  const { url, type = "video", info } = req.query;

  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).json({ error: "URL YouTube tidak valid" });
  }

  try {
    const infoData = await ytdl.getInfo(url);
    const { title, lengthSeconds, videoId, thumbnails, author } = infoData.videoDetails;
    const safeTitle = title.replace(/[^\w\s]/gi, "_");

    if (info === "true") {
      return res.status(200).json({
        videoId,
        title,
        duration: `${Math.floor(lengthSeconds / 60)}:${String(lengthSeconds % 60).padStart(2, "0")}`,
        author: author.name,
        thumbnail: thumbnails.at(-1)?.url,
        formats: ytdl.filterFormats(infoData.formats, type === "audio" ? "audioonly" : "videoandaudio"),
      });
    }

    if (type === "audio") {
      res.setHeader("Content-Disposition", `attachment; filename="${safeTitle}.mp3"`);
      res.setHeader("Content-Type", "audio/mpeg");
      return ytdl(url, { filter: "audioonly", quality: "highestaudio" }).pipe(res);
    } else {
      res.setHeader("Content-Disposition", `attachment; filename="${safeTitle}.mp4"`);
      res.setHeader("Content-Type", "video/mp4");
      return ytdl(url, { filter: "audioandvideo", quality: "18" }).pipe(res);
    }
  } catch (err) {
  console.error("❌ Gagal proses:", err);
  res.status(500).json({
    error: "Gagal memproses video",
    reason: err.message || "Unknown error"
  });
}
           }

