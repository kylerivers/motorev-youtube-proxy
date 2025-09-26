// Advanced YouTube Anti-Detection Bypass System
const REAL_BROWSER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
];

const LANGUAGES = ['en-US,en;q=0.9', 'en-GB,en;q=0.8', 'en;q=0.7'];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateSessionFingerprint() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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
  
  // Anti-detection strategy rotation
  const strategies = [
    'mobile_bypass',
    'embedded_bypass', 
    'api_bypass',
    'stealth_desktop'
  ];
  
  for (const strategy of strategies) {
    try {
      console.log(`🎵 [VERCEL PROXY] Trying strategy: ${strategy} for ${id}`);
      
      const result = await attemptExtraction(id, strategy);
      if (result) {
        console.log(`🎵 [VERCEL PROXY] SUCCESS with ${strategy}: ${result.title}`);
        return res.json(result);
      }
      
      // Random delay between attempts to avoid rate limiting
      await sleep(Math.random() * 2000 + 1000);
      
    } catch (error) {
      console.log(`🎵 [VERCEL PROXY] Strategy ${strategy} failed: ${error.message}`);
      continue;
    }
  }
  
  return res.status(500).json({ 
    error: 'All extraction strategies failed',
    details: 'YouTube has blocked all known extraction methods',
    videoId: id
  });
}

async function attemptExtraction(videoId, strategy) {
  const sessionId = generateSessionFingerprint();
  
  switch (strategy) {
    case 'mobile_bypass':
      return await mobileBypass(videoId, sessionId);
      
    case 'embedded_bypass':
      return await embeddedBypass(videoId, sessionId);
      
    case 'api_bypass':
      return await apiBypass(videoId, sessionId);
      
    case 'stealth_desktop':
      return await stealthDesktop(videoId, sessionId);
      
    default:
      throw new Error('Unknown strategy');
  }
}

async function mobileBypass(videoId, sessionId) {
  // Mimic mobile YouTube app request
  const response = await fetch(`https://m.youtube.com/watch?v=${videoId}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': getRandomElement(LANGUAGES),
      'Accept-Encoding': 'gzip, deflate, br',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'X-Session-ID': sessionId
    }
  });
  
  return await extractFromHtml(await response.text(), videoId);
}

async function embeddedBypass(videoId, sessionId) {
  // Use embed URL which has different detection rules
  const response = await fetch(`https://www.youtube.com/embed/${videoId}`, {
    headers: {
      'User-Agent': getRandomElement(REAL_BROWSER_AGENTS),
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': getRandomElement(LANGUAGES),
      'Referer': 'https://google.com/',
      'X-Session-ID': sessionId
    }
  });
  
  return await extractFromHtml(await response.text(), videoId);
}

async function apiBypass(videoId, sessionId) {
  // Try YouTube's internal API endpoints
  const apiResponse = await fetch(`https://www.youtube.com/youtubei/v1/player?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': getRandomElement(REAL_BROWSER_AGENTS),
      'X-Session-ID': sessionId
    },
    body: JSON.stringify({
      context: {
        client: {
          clientName: 'WEB',
          clientVersion: '2.20231201.01.00'
        }
      },
      videoId: videoId
    })
  });
  
  const data = await apiResponse.json();
  
  if (data.streamingData && data.streamingData.adaptiveFormats) {
    const audioFormats = data.streamingData.adaptiveFormats.filter(f => 
      f.mimeType && f.mimeType.includes('audio/') && f.url
    );
    
    if (audioFormats.length > 0) {
      const bestAudio = audioFormats.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))[0];
      
      return {
        audioUrl: bestAudio.url,
        title: data.videoDetails?.title || 'Unknown Title',
        artist: data.videoDetails?.author || 'Unknown Artist',
        duration: parseInt(data.videoDetails?.lengthSeconds) || 0,
        videoId: videoId
      };
    }
  }
  
  throw new Error('API bypass failed - no audio formats');
}

async function stealthDesktop(videoId, sessionId) {
  // Maximum stealth desktop browser simulation
  const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
    headers: {
      'User-Agent': getRandomElement(REAL_BROWSER_AGENTS),
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': getRandomElement(LANGUAGES),
      'Accept-Encoding': 'gzip, deflate, br',
      'Cache-Control': 'max-age=0',
      'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
      'Referer': 'https://www.google.com/',
      'X-Session-ID': sessionId
    }
  });
  
  return await extractFromHtml(await response.text(), videoId);
}

async function extractFromHtml(html, videoId) {
  // Multiple extraction patterns
  const patterns = [
    /var ytInitialPlayerResponse = ({.*?});/s,
    /window\["ytInitialPlayerResponse"\] = ({.*?});/s,
    /"streamingData":\s*({.*?"adaptiveFormats".*?})/s
  ];
  
  for (const pattern of patterns) {
    try {
      const match = html.match(pattern);
      if (match) {
        const data = JSON.parse(match[1]);
        
        let streamingData = data.streamingData || data;
        if (!streamingData.adaptiveFormats && data.streamingData) {
          streamingData = data.streamingData;
        }
        
        if (streamingData && streamingData.adaptiveFormats) {
          const audioFormats = streamingData.adaptiveFormats.filter(f => 
            f.mimeType && f.mimeType.includes('audio/') && f.url && 
            !f.url.includes('youtube.com/watch')
          );
          
          if (audioFormats.length > 0) {
            const bestAudio = audioFormats.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))[0];
            
            return {
              audioUrl: bestAudio.url,
              title: data.videoDetails?.title || 'Unknown Title',
              artist: data.videoDetails?.author || 'Unknown Artist', 
              duration: parseInt(data.videoDetails?.lengthSeconds) || 0,
              videoId: videoId
            };
          }
        }
      }
    } catch (parseError) {
      continue;
    }
  }
  
  throw new Error('No audio formats found in HTML');
}