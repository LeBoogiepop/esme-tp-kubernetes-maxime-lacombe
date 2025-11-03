const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send(`
    <h1>Hello ESME DevOps 2025!</h1>
    <p>Application déployée le: ${new Date().toISOString()}</p>
    <p>Version: 1.0.0</p>
  `);
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`App running on port ${port}`);
});
