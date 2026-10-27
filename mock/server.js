const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const authMiddleware = require('./middlewares/auth');

const dbPath = path.join(__dirname, 'db.json');
const port = Number(process.env.MOCK_PORT || 3001);

function readDb() {
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

function writeDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

const server = http.createServer((req, res) => {
  let rawBody = '';
  req.on('data', (chunk) => {
    rawBody += chunk;
  });
  req.on('end', () => {
    try {
      req.body = rawBody ? JSON.parse(rawBody) : {};
    } catch {
      req.body = {};
    }

    authMiddleware(req, res, () => {
      const db = readDb();
      const cleanUrl = (req.url || '/').replace(/^\/api/, '');
      res.setHeader('Content-Type', 'application/json');

      if (cleanUrl.startsWith('/todos') && req.method === 'GET') {
        res.statusCode = 200;
        res.end(JSON.stringify(db.todos));
        return;
      }

      if (cleanUrl.startsWith('/todos') && req.method === 'POST') {
        const nextItem = {
          id: Date.now(),
          userId: req.body.userId || 1,
          title: req.body.title || 'Новая задача',
          completed: Boolean(req.body.completed),
          createdAt: new Date().toISOString(),
          priority: req.body.priority || 'medium',
          tagIds: req.body.tagIds || []
        };
        db.todos.unshift(nextItem);
        writeDb(db);
        res.statusCode = 201;
        res.end(JSON.stringify(nextItem));
        return;
      }

      if (cleanUrl.startsWith('/users') && req.method === 'GET') {
        res.statusCode = 200;
        res.end(JSON.stringify(db.users));
        return;
      }

      if (cleanUrl.startsWith('/tags') && req.method === 'GET') {
        res.statusCode = 200;
        res.end(JSON.stringify(db.tags));
        return;
      }

      res.statusCode = 404;
      res.end(JSON.stringify({ message: 'Маршрут не найден' }));
    });
  });
});

if (require.main === module) {
  server.listen(port, () => {
    process.stdout.write(`Mock server listening on http://localhost:${port}\n`);
  });
}

module.exports = server;
