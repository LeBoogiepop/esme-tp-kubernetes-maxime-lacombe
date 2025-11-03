const express = require('express');
const app = express();
const port = 3000;

// Version de l'application
const APP_VERSION = '2.0.0';

// Variables d'environnement avec valeurs par défaut
const APP_ENV = process.env.APP_ENV || 'development';
const LOG_LEVEL = process.env.LOG_LEVEL || 'debug';
const MESSAGE = process.env.MESSAGE || 'Bienvenue sur ESME DevOps 2025';

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>ESME DevOps 2025</title>
      </head>
      <body style="font-family: Arial; max-width: 800px; margin: 50px auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
        <h1>🚀 Hello ESME DevOps 2025! - Version ${APP_VERSION}</h1>
        <p><strong>Environnement:</strong> ${APP_ENV}</p>
        <p><strong>Message:</strong> ${MESSAGE}</p>
        <p><strong>Niveau de log:</strong> ${LOG_LEVEL}</p>
        <p><strong>Version:</strong> ${APP_VERSION}</p>
        <p><em>✨ Application containerisée avec rolling update réussi ! ✨</em></p>
      </body>
    </html>
  `);
});

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: APP_ENV,
    version: APP_VERSION
  });
});

// Endpoint /info pour informations détaillées
app.get('/info', (req, res) => {
  res.json({
    application: 'ESME DevOps App',
    version: APP_VERSION,
    environment: APP_ENV,
    uptime: process.uptime(),
    hostname: require('os').hostname(),
    platform: process.platform,
    nodeVersion: process.version,
    features: ['ConfigMap', 'HPA', 'Ingress', 'Rolling Update']
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`App running on port ${port}`);
  console.log(`Version: ${APP_VERSION}`);
  console.log(`Environment: ${APP_ENV}`);
  console.log(`Log level: ${LOG_LEVEL}`);
});
