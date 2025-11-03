# TP Kubernetes ESME - Maxime

## Description
Application Node.js de démonstration pour le TP d'évaluation Kubernetes 2025.

## Informations du projet
- **Étudiant**: Maxime ESME
- **Date**: 3 Novembre 2025
- **Cluster**: aks-MaximeESME (Azure Kubernetes Service)

## Structure du projet
```
.
├── app.js              # Application Node.js Express
├── package.json        # Dépendances Node.js
├── Dockerfile          # Configuration de conteneurisation
├── k8s/                # Manifests Kubernetes
└── README.md           # Documentation
```

## Version actuelle
- **v1.0.0** - Application avec support des variables d'environnement et 3 endpoints

## URL de l'image Docker
**Docker Hub** : https://hub.docker.com/r/booogiepop/esme-app

**Pull de l'image** :
```bash
docker pull booogiepop/esme-app:v1.0
```

**Lancer l'application** :
```bash
docker run -d -p 3000:3000 booogiepop/esme-app:v1.0
```

## Endpoints disponibles
- `GET /` - Page d'accueil avec informations de déploiement et variables d'environnement
- `GET /health` - Health check endpoint (retourne JSON avec status et environnement)
- `GET /info` - Informations techniques détaillées (uptime, hostname, version)

## Démarrage local
```bash
npm install
npm start
```

L'application sera accessible sur http://localhost:3000

## Notes de développement
- Port d'écoute: 3000
- Framework: Express 4.18.2
- Node.js version recommandée: 18+
