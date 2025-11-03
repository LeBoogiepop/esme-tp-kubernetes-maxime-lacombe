const express = require('express');
const app = express();
const port = 3000;

// Variables d'environnement avec valeurs par défaut
const appEnv = process.env.APP_ENV || 'development';
const logLevel = process.env.LOG_LEVEL || 'debug';
const message = process.env.MESSAGE || 'Déployé par un étudiant ESME';

app.get('/', (req, res) => {
  res.send(`
    <h1>Hello ESME DevOps 2025!</h1>
    <p>Application déployée le: ${new Date().toISOString()}</p>
    <p>Version: 1.0.0</p>
    <p>Environnement: ${appEnv}</p>
    <p>Message: ${message}</p>
    <div style="margin-top: 20px; padding: 10px; background-color: #f0f0f0;">
      <h3>Informations techniques :</h3>
      <ul>
        <li>Niveau de log: ${logLevel}</li>
        <li>Hostname: ${process.env.HOSTNAME || 'localhost'}</li>
        <li>Port: ${port}</li>
      </ul>
    </div>
  `);
});

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: appEnv,
    version: '1.0.0'
  });
});

app.get('/info', (req, res) => {
  res.json({
    app: 'esme-devops-app',
    version: '1.0.0',
    environment: appEnv,
    logLevel: logLevel,
    message: message,
    uptime: process.uptime(),
    hostname: process.env.HOSTNAME || 'localhost'
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`App running on port ${port}`);
  console.log(`Environment: ${appEnv}`);
  console.log(`Log level: ${logLevel}`);
});
