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
    console.log(`🎵 [VERCEL PROXY] Simple HTML extraction for: ${id}`);
    
    // Simple HTML extraction without file system dependencies
    const response = await fetch(`https://www.youtube.com/watch?v=${id}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const html = await response.text();
    
    // Extract player response from HTML
    const playerResponseMatch = html.match(/var ytInitialPlayerResponse = ({.*?});/s);
    if (!playerResponseMatch) {
      throw new Error('No player response found in HTML');
    }
    
    const playerResponse = JSON.parse(playerResponseMatch[1]);
    
    if (!playerResponse.streamingData || !playerResponse.streamingData.adaptiveFormats) {
      throw new Error('No streaming data found');
    }
    
    // Filter for audio-only formats
    const audioFormats = playerResponse.streamingData.adaptiveFormats.filter(f => 
      f.mimeType && f.mimeType.includes('audio/') && f.url && 
      !f.url.includes('youtube.com/watch')
    );
    
    if (audioFormats.length === 0) {
      throw new Error('No audio formats found');
    }
    
    // Get best quality audio
    const bestAudio = audioFormats.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))[0];
    
    const title = playerResponse.videoDetails?.title || 'Unknown Title';
    const author = playerResponse.videoDetails?.author || 'Unknown Artist';
    const duration = parseInt(playerResponse.videoDetails?.lengthSeconds) || 0;
    
    console.log(`🎵 [VERCEL PROXY] SUCCESS: Found audio URL for ${title}`);
    
    return res.json({ 
      audioUrl: bestAudio.url,
      title: title,
      artist: author,
      duration: duration,
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