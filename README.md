# YouTube Downloader API

API sederhana untuk download Audio / Video dari YouTube.
Dibuat dengan Node.js + ytdl-core, siap di-deploy di Vercel.

## Endpoint


### Query Params

- `url` (wajib) – URL video YouTube  
- `type` (optional) – `"audio"` atau `"video"` (default `"video"`)  
- `info` (optional) – `"true"` untuk metadata saja

## Contoh

- `?url=…&type=audio` → download MP3  
- `?url=…&type=video` → download MP4  
- `?url=…&info=true` → JSON metadata video  

## Deploy

1. Push ke GitHub
2. Import repo di Vercel → otomatis jadi API
