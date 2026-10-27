const PUBLIC_PATHS = ['/api/auth/login', '/api/auth/register', '/api/auth/refresh', '/auth/login', '/auth/register', '/tags'];

function createMockToken(userId, email) {
  const payload = Buffer.from(JSON.stringify({ sub: userId, email, exp: Date.now() + 3600000 })).toString('base64');
  return `mock-jwt.${payload}.signature`;
}

function verifyMockToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.slice('Bearer '.length).trim();
  if (!token.startsWith('mock-jwt.')) {
    return null;
  }
  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }
  try {
    const decoded = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
    if (decoded.exp && decoded.exp < Date.now()) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

module.exports = function authMiddleware(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  const delayMs = Number(process.env.MOCK_DELAY_MS || 250);

  setTimeout(() => {
    if (req.url === '/api/auth/login' || req.url === '/auth/login') {
      const body = req.body || {};
      const email = body.email || 'ivan@example.com';
      const accessToken = createMockToken(1, email);
      const refreshToken = `refresh.${accessToken}`;
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify({
        accessToken,
        refreshToken,
        user: { id: 1, name: email.split('@')[0] || 'User', email }
      }));
      return;
    }

    if (req.url === '/api/auth/refresh' || req.url === '/auth/refresh') {
      const accessToken = createMockToken(1, 'ivan@example.com');
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify({ accessToken }));
      return;
    }

    const isPublic = PUBLIC_PATHS.some((path) => req.url.startsWith(path));
    if (!isPublic && req.method !== 'GET') {
      const user = verifyMockToken(req.headers.authorization);
      if (!user) {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 401;
        res.end(JSON.stringify({ message: 'Требуется авторизация (недействительный JWT токен)' }));
        return;
      }
    }

    next();
  }, delayMs);
};
