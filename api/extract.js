import ytdl from '@distube/ytdl-core';

export default async function handler(req, res) {
  // Enable CORS for Railway requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { videoId, videoUrl } = req.body || {};
  const id = videoId || (videoUrl ? videoUrl.split('v=')[1]?.split('&')[0] : null);
  
  if (!id) {
    return res.status(400).json({ error: 'No video ID provided' });
  }
  
  try {
    console.log(`🎵 [VERCEL PROXY] Extracting audio for: ${id}`);
    
    // Use @distube/ytdl-core with clean IP from Vercel
    const info = await ytdl.getInfo(id, {
      requestOptions: {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive'
        }
      }
    });
    
    if (!info || !info.formats) {
      return res.status(404).json({ error: 'No video info found' });
    }
    
    // Filter for audio-only formats
    const audioFormats = info.formats.filter(f => 
      f.hasAudio && !f.hasVideo && f.url && f.url.includes('googlevideo.com')
    );
    
    if (audioFormats.length === 0) {
      return res.status(404).json({ error: 'No audio formats found' });
    }
    
    // Get best quality audio
    const bestAudio = audioFormats.sort((a, b) => 
      (b.audioBitrate || 0) - (a.audioBitrate || 0)
    )[0];
    
    console.log(`🎵 [VERCEL PROXY] SUCCESS: Found audio URL for ${info.videoDetails.title}`);
    
    return res.json({ 
      audioUrl: bestAudio.url,
      title: info.videoDetails.title,
      artist: info.videoDetails.author?.name || 'Unknown Artist',
      duration: parseInt(info.videoDetails.lengthSeconds) || 0,
      videoId: id
    });
    
  } catch (error) {
    console.error('🎵 [VERCEL PROXY] Extraction error:', error.message);
    return res.status(500).json({ 
      error: 'YouTube extraction failed',
      details: error.message,
      videoId: id
    });
  }
}