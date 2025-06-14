import ytdl from 'ytdl-core';

export default async function handler(req, res) {
  const { url, type = "video", info } = req.query;

  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).json({ error: "URL YouTube tidak valid" });
  }

  try {
    const videoInfo = await ytdl.getInfo(url);
    const title = videoInfo.videoDetails.title.replace(/[^\w\s]/gi, "_");

    if (info === "true") {
      return res.status(200).json({
        title: videoInfo.videoDetails.title,
        thumbnail: videoInfo.videoDetails.thumbnails.at(-1)?.url,
        author: videoInfo.videoDetails.author.name,
        duration: `${Math.floor(videoInfo.videoDetails.lengthSeconds / 60)}:${videoInfo.videoDetails.lengthSeconds % 60}`,
        formats: videoInfo.formats.map(f => ({
          quality: f.qualityLabel,
          mimeType: f.mimeType,
          url: f.url
        }))
      });
    }

    if (type === "audio") {
      res.setHeader("Content-Disposition", `attachment; filename="${title}.mp3"`);
      res.setHeader("Content-Type", "audio/mpeg");
      return ytdl(url, { filter: "audioonly", quality: "highestaudio" }).pipe(res);
    } else {
      res.setHeader("Content-Disposition", `attachment; filename="${title}.mp4"`);
      res.setHeader("Content-Type", "video/mp4");
      return ytdl(url, { filter: "audioandvideo", quality: "18" }).pipe(res);
    }

  } catch (err) {
    console.error("❌ Gagal proses video:", err.message);
    res.status(500).json({ error: "Gagal memproses video", reason: err.message });
  }
}
