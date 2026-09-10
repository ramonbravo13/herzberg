import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Determine the environment to set Secure flag correctly
    const isProd = process.env.NODE_ENV === 'production';
    
    // Parse existing cookies
    const cookieHeader = req.headers.cookie || '';
    const hasSession = cookieHeader.includes('herzberg_participant_id=');

    let participantId;
    if (!hasSession) {
      participantId = uuidv4();
      const maxAge = 60 * 60 * 24 * 365; // 1 year
      const cookieString = \`herzberg_participant_id=\${participantId}; HttpOnly; Path=/; Max-Age=\${maxAge}; SameSite=Strict\${isProd ? '; Secure' : ''}\`;
      res.setHeader('Set-Cookie', cookieString);
    }

    return res.status(200).json({ success: true, message: 'Session initialized' });
  } catch (error) {
    console.error('Session Init Error:', error);
    return res.status(500).json({ error: 'Error initializing session' });
  }
}
