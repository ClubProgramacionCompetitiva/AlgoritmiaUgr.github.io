/**
 * Next.js API Route - Advent of Code Leaderboard Proxy
 * 
 * Fetches the private AoC leaderboard using session cookie authentication.
 * Implements caching to respect AoC's rate limits and improve performance.
 * 
 * Environment Variables Required:
 * - LEADERBOARD_ID: Your private leaderboard ID
 * - AOC_SESSION_COOKIE: Your session cookie value from adventofcode.com
 * - YEAR (optional): Contest year, defaults to 2025
 */

// Simple in-memory cache
let cache = {
  data: null,
  timestamp: 0
};

const CACHE_TTL = 15 * 60 * 1000; // 15 minutes in milliseconds
const LEADERBOARD_ID = process.env.LEADERBOARD_ID || '5184163-4f9d2564';
const SESSION_COOKIE = process.env.AOC_SESSION_COOKIE || '';
const YEAR = process.env.YEAR || '2025';

async function fetchAoCLeaderboard() {
  const url = `https://adventofcode.com/${YEAR}/leaderboard/private/view/${LEADERBOARD_ID}.json`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Cookie': `session=${SESSION_COOKIE}`,
        'User-Agent': 'CPC-UGR-Leaderboard/1.0 (+https://cpcugr.vercel.app)'
      },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`AoC API returned ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching AoC leaderboard:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to fetch leaderboard data'
    };
  }
}

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if we have valid cached data
  const now = Date.now();
  if (cache.data && (now - cache.timestamp) < CACHE_TTL) {
    res.setHeader('X-Cache', 'HIT');
    res.setHeader('Cache-Control', `public, s-maxage=${Math.floor((CACHE_TTL - (now - cache.timestamp)) / 1000)}, stale-while-revalidate`);
    return res.status(200).json(cache.data);
  }

  // Check if session cookie is configured
  if (!SESSION_COOKIE || SESSION_COOKIE === '') {
    return res.status(500).json({ 
      error: 'Leaderboard not configured',
      message: 'AOC_SESSION_COOKIE environment variable is not set'
    });
  }

  // Fetch fresh data
  const result = await fetchAoCLeaderboard();

  if (result.success) {
    // Update cache
    cache.data = result.data;
    cache.timestamp = now;

    res.setHeader('X-Cache', 'MISS');
    res.setHeader('Cache-Control', `public, s-maxage=${CACHE_TTL / 1000}, stale-while-revalidate`);
    return res.status(200).json(result.data);
  } else {
    // Return error but keep old cache if available
    if (cache.data) {
      res.setHeader('X-Cache', 'STALE');
      res.setHeader('X-Error', result.error);
      return res.status(200).json(cache.data);
    }
    
    return res.status(502).json({ 
      error: 'Failed to fetch leaderboard',
      details: result.error
    });
  }
}
