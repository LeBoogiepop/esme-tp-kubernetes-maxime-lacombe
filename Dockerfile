# Utilisation d'une image Node.js officielle LTS (Long Term Support)
FROM node:18-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances de production uniquement
RUN npm install --production

# Copier le code source de l'application
COPY app.js .

# Exposer le port 3000 sur lequel l'application écoute
EXPOSE 3000

# Définir la commande de démarrage de l'application
CMD ["npm", "start"]
