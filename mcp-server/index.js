const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/mcp', (req, res) => {
  res.json({ status: 'ok', info: 'MCP test endpoint' });
});

app.post('/mcp', (req, res) => {
  console.log('/mcp POST received:', JSON.stringify(req.body));
  // Echo back minimal MCP-like response
  res.json({ ok: true, received: req.body });
});

const PORT = 3845;
app.listen(PORT, () => {
  console.log(`MCP test server listening on http://127.0.0.1:${PORT}/mcp`);
});
