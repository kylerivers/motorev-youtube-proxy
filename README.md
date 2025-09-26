# MotoRev YouTube Proxy Service

This Vercel serverless function extracts YouTube audio URLs using clean IPs to bypass Railway's blocked IPs.

## Deployment

1. Deploy this repository to Vercel
2. Update the MotoRev backend with your Vercel deployment URL
3. YouTube music extraction will work through this proxy

## API Endpoint

`POST /api/extract`

Request body:
```json
{
  "videoId": "dQw4w9WgXcQ"
}
```

Response:
```json
{
  "audioUrl": "https://r1---sn-...",
  "title": "Video Title",
  "artist": "Channel Name",
  "duration": 213,
  "videoId": "dQw4w9WgXcQ"
}
```