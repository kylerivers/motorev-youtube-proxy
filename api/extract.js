// OXYLABS TUTORIAL IMPLEMENTATION - Bypassing Sophisticated Anti-Bot Systems
const NEW_HEADLESS_CHROME_AGENTS = [
  // NEW HEADLESS CHROME - from tutorial example 4 that worked!
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
];

const GEOLOCATION_HEADERS = {
  'fr': { 'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8', 'CF-IPCountry': 'FR' },
  'us': { 'Accept-Language': 'en-US,en;q=0.9', 'CF-IPCountry': 'US' },
  'gb': { 'Accept-Language': 'en-GB,en;q=0.9', 'CF-IPCountry': 'GB' },
  'de': { 'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8', 'CF-IPCountry': 'DE' }
};

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateBrowserFingerprint() {
  // TUTORIAL TECHNIQUE: Browser fingerprint generation for consistency
  const platforms = ['Win32', 'MacIntel', 'Linux x86_64'];
  const platform = getRandomElement(platforms);
  
  return {
    sessionId: Math.random().toString(36).substring(2, 15),
    platform: platform,
    userAgent: getRandomElement(NEW_HEADLESS_CHROME_AGENTS),
    viewport: getRandomElement(['1920,1080', '1366,768', '1440,900']),
    timezone: getRandomElement(['America/New_York', 'Europe/London', 'Europe/Paris']),
    geolocation: getRandomElement(['us', 'gb', 'fr', 'de'])
  };
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
  
  // TUTORIAL TECHNIQUE: Use successful strategies from Oxylabs demonstration
  const tutorialStrategies = [
    'oxylabs_example4_newheadless', // Example 4 that worked in tutorial!
    'oxylabs_example5_unblocker',   // Example 5 with custom headers
    'tutorial_retry_logic'          // Proper retry handling
  ];
  
  for (const strategy of tutorialStrategies) {
    try {
      console.log(`🎵 [VERCEL PROXY] TUTORIAL STRATEGY: ${strategy} for ${id}`);
      
      const result = await tutorialExtraction(id, strategy);
      if (result) {
        console.log(`🎵 [VERCEL PROXY] SUCCESS with ${strategy}: ${result.title}`);
        return res.json(result);
      }
      
      // Tutorial technique: Small delay between attempts
      await sleep(Math.random() * 1000 + 500);
      
    } catch (error) {
      console.log(`🎵 [VERCEL PROXY] Tutorial strategy ${strategy} failed: ${error.message}`);
      continue;
    }
  }
  
  // Fallback to nuclear option if tutorial strategies fail
  const nuclearServices = [
    'y2mate_bypass',
    'ytdl_public_api', 
    'cobalt_tools',
    'yt1s_bypass'
  ];
  
  for (const service of nuclearServices) {
    try {
      console.log(`🎵 [VERCEL PROXY] NUCLEAR FALLBACK: ${service} for ${id}`);
      
      const result = await useWorkingService(id, service);
      if (result) {
        console.log(`🎵 [VERCEL PROXY] NUCLEAR SUCCESS with ${service}: ${result.title}`);
        return res.json(result);
      }
      
      await sleep(1000);
      
    } catch (error) {
      console.log(`🎵 [VERCEL PROXY] Nuclear service ${service} failed: ${error.message}`);
      continue;
    }
  }
  
  // Original strategies as final fallback
  const fallbackStrategies = [
    'mobile_bypass',
    'embedded_bypass', 
    'api_bypass',
    'stealth_desktop'
  ];
  
  for (const strategy of fallbackStrategies) {
    try {
      console.log(`🎵 [VERCEL PROXY] Fallback strategy: ${strategy} for ${id}`);
      
      const result = await attemptExtraction(id, strategy);
      if (result) {
        console.log(`🎵 [VERCEL PROXY] SUCCESS with ${strategy}: ${result.title}`);
        return res.json(result);
      }
      
      await sleep(Math.random() * 2000 + 1000);
      
    } catch (error) {
      console.log(`🎵 [VERCEL PROXY] Strategy ${strategy} failed: ${error.message}`);
      continue;
    }
  }
  
  return res.status(500).json({ 
    error: 'All extraction methods failed',
    details: 'YouTube blocking all known techniques',
    videoId: id
  });
}

async function tutorialExtraction(videoId, strategy) {
  const fingerprint = generateBrowserFingerprint();
  
  switch (strategy) {
    case 'oxylabs_example4_newheadless':
      return await oxyLabsExample4NewHeadless(videoId, fingerprint);
      
    case 'oxylabs_example5_unblocker':
      return await oxyLabsExample5Unblocker(videoId, fingerprint);
      
    case 'tutorial_retry_logic':
      return await tutorialRetryLogic(videoId, fingerprint);
      
    default:
      throw new Error('Unknown tutorial strategy');
  }
}

async function oxyLabsExample4NewHeadless(videoId, fingerprint) {
  // EXACT REPRODUCTION of tutorial Example 4 that succeeded!
  // "NEW HEADLESS CHROME + REFERRER + RETRY HANDLING"
  console.log(`🎵 [Tutorial Example 4] New headless Chrome approach for ${videoId}`);
  
  const geoHeaders = GEOLOCATION_HEADERS[fingerprint.geolocation];
  
  const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
    headers: {
      'User-Agent': fingerprint.userAgent,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': geoHeaders['Accept-Language'],
      'Accept-Encoding': 'gzip, deflate, br',
      'Cache-Control': 'max-age=0',
      'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="121", "Google Chrome";v="121"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': `"${fingerprint.platform}"`,
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
      'Referer': 'https://www.google.com/', // CRITICAL: Referrer that worked in tutorial
      'CF-IPCountry': geoHeaders['CF-IPCountry'],
      'X-Forwarded-For': generateRandomIP(),
      'X-Session-ID': fingerprint.sessionId
    }
  });
  
  const html = await response.text();
  
  // Tutorial retry logic: Try again with different approach if failed
  if (response.status !== 200 || html.includes('bot')) {
    throw new Error(`Example 4 failed: ${response.status} - detected as bot`);
  }
  
  return await extractFromHtml(html, videoId);
}

async function oxyLabsExample5Unblocker(videoId, fingerprint) {
  // REPRODUCTION of tutorial Example 5 - Web Unblocker approach
  // "CUSTOM HEADERS FOR RENDERING + GEOLOCATION"
  console.log(`🎵 [Tutorial Example 5] Web Unblocker simulation for ${videoId}`);
  
  const geoHeaders = GEOLOCATION_HEADERS[fingerprint.geolocation];
  
  const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
    headers: {
      'User-Agent': fingerprint.userAgent,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': geoHeaders['Accept-Language'],
      'Accept-Encoding': 'gzip, deflate, br',
      'Referer': 'https://www.google.com/',
      'CF-IPCountry': geoHeaders['CF-IPCountry'],
      'X-Forwarded-For': generateRandomIP(),
      'X-Session-ID': fingerprint.sessionId,
      // WEB UNBLOCKER SIMULATION HEADERS
      'X-Oxylabs-Geo-Location': fingerprint.geolocation.toUpperCase(),
      'X-Oxylabs-Render': 'html', // Equivalent to requiring rendering
      'X-Oxylabs-Parse': '1',     // Custom parsing requirement
      'Connection': 'keep-alive',
      'Viewport-Width': fingerprint.viewport.split(',')[0],
      'Viewport-Height': fingerprint.viewport.split(',')[1]
    }
  });
  
  const html = await response.text();
  
  if (response.status !== 200) {
    throw new Error(`Example 5 failed: ${response.status}`);
  }
  
  return await extractFromHtml(html, videoId);
}

async function tutorialRetryLogic(videoId, fingerprint) {
  // TUTORIAL RETRY STRATEGY: Multiple attempts with different configurations
  console.log(`🎵 [Tutorial Retry Logic] Smart retry approach for ${videoId}`);
  
  const retryConfigs = [
    { geoLocation: 'us', mobile: false },
    { geoLocation: 'fr', mobile: true },
    { geoLocation: 'gb', mobile: false },
    { geoLocation: 'de', mobile: true }
  ];
  
  for (const config of retryConfigs) {
    try {
      const geoHeaders = GEOLOCATION_HEADERS[config.geoLocation];
      const userAgent = config.mobile 
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
        : fingerprint.userAgent;
      
      const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
        headers: {
          'User-Agent': userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': geoHeaders['Accept-Language'],
          'Referer': 'https://www.google.com/',
          'CF-IPCountry': geoHeaders['CF-IPCountry'],
          'X-Forwarded-For': generateRandomIP(),
          'X-Session-ID': fingerprint.sessionId + '-retry'
        }
      });
      
      if (response.status === 200) {
        const html = await response.text();
        const result = await extractFromHtml(html, videoId);
        if (result) {
          console.log(`🎵 [Tutorial Retry] SUCCESS with ${config.geoLocation} ${config.mobile ? 'mobile' : 'desktop'}`);
          return result;
        }
      }
      
      // Tutorial technique: delay between retries
      await sleep(Math.random() * 1500 + 500);
      
    } catch (error) {
      continue;
    }
  }
  
  throw new Error('Tutorial retry logic exhausted');
}

function generateRandomIP() {
  // Generate realistic IP ranges
  const ranges = [
    '203.0.113', // Documentation range
    '198.51.100', // Documentation range  
    '10.0.0',     // Private range
    '172.16.0'    // Private range
  ];
  
  const range = getRandomElement(ranges);
  const lastOctet = Math.floor(Math.random() * 254) + 1;
  return `${range}.${lastOctet}`;
}

async function useWorkingService(videoId, service) {
  switch (service) {
    case 'y2mate_bypass':
      return await y2mateBypass(videoId);
    case 'ytdl_public_api':
      return await ytdlPublicApi(videoId);
    case 'cobalt_tools':
      return await cobaltTools(videoId);
    case 'yt1s_bypass':
      return await yt1sBypass(videoId);
    default:
      throw new Error('Unknown service');
  }
}

async function y2mateBypass(videoId) {
  // Y2mate has working YouTube extraction
  try {
    const response = await fetch('https://www.y2mate.com/mates/analyzeV2/ajax', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.y2mate.com/'
      },
      body: `url=https://www.youtube.com/watch?v=${videoId}&q_auto=1&ajax=1`
    });
    
    const data = await response.json();
    if (data.status === 'ok' && data.result) {
      // Parse HTML response for audio links
      const audioMatch = data.result.match(/data-fquality="128"[^>]*data-ftype="mp3"[^>]*href="([^"]+)"/);
      if (audioMatch) {
        return {
          audioUrl: audioMatch[1],
          title: data.title || 'Unknown Title',
          artist: 'YouTube',
          duration: 0,
          videoId: videoId
        };
      }
    }
  } catch (error) {
    throw new Error(`Y2mate failed: ${error.message}`);
  }
  
  throw new Error('Y2mate - no audio found');
}

async function ytdlPublicApi(videoId) {
  // Try public YTDL API services
  const publicApis = [
    'https://youtube-dl-api.herokuapp.com/api/info',
    'https://ytdl-api.vercel.app/api/info'
  ];
  
  for (const apiUrl of publicApis) {
    try {
      const response = await fetch(`${apiUrl}?url=https://www.youtube.com/watch?v=${videoId}`);
      const data = await response.json();
      
      if (data.formats) {
        const audioFormats = data.formats.filter(f => f.acodec && f.acodec !== 'none' && f.url);
        if (audioFormats.length > 0) {
          const bestAudio = audioFormats.sort((a, b) => (b.abr || 0) - (a.abr || 0))[0];
          
          return {
            audioUrl: bestAudio.url,
            title: data.title || 'Unknown Title',
            artist: data.uploader || 'YouTube',
            duration: data.duration || 0,
            videoId: videoId
          };
        }
      }
    } catch (error) {
      continue;
    }
  }
  
  throw new Error('Public YTDL APIs failed');
}

async function cobaltTools(videoId) {
  // Cobalt.tools is a popular YouTube downloader
  try {
    const response = await fetch('https://co.wuk.sh/api/json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        url: `https://www.youtube.com/watch?v=${videoId}`,
        isAudioOnly: true,
        aFormat: 'mp3'
      })
    });
    
    const data = await response.json();
    if (data.status === 'success' && data.url) {
      return {
        audioUrl: data.url,
        title: 'YouTube Audio',
        artist: 'YouTube',
        duration: 0,
        videoId: videoId
      };
    }
  } catch (error) {
    throw new Error(`Cobalt.tools failed: ${error.message}`);
  }
  
  throw new Error('Cobalt.tools - no audio found');
}

async function yt1sBypass(videoId) {
  // YT1S is another working service
  try {
    const response = await fetch('https://www.yt1s.com/api/ajaxSearch/index', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: `q=https://www.youtube.com/watch?v=${videoId}&vt=home`
    });
    
    const data = await response.json();
    if (data.status === 'ok' && data.result) {
      // Parse for MP3 download links
      const mp3Match = data.result.match(/data-ftype="mp3"[^>]*data-fquality="128"[^>]*href="([^"]+)"/);
      if (mp3Match) {
        return {
          audioUrl: mp3Match[1],
          title: data.title || 'Unknown Title',
          artist: 'YouTube',
          duration: 0,
          videoId: videoId
        };
      }
    }
  } catch (error) {
    throw new Error(`YT1S failed: ${error.message}`);
  }
  
  throw new Error('YT1S - no audio found');
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