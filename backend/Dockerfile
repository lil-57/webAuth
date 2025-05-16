# Étape 1 : Build
FROM node:20-alpine AS builder

WORKDIR /app

# Installer pnpm
RUN npm install -g pnpm

# Copier les fichiers nécessaires
COPY . .

# Installer les dépendances
RUN pnpm install --frozen-lockfile

# Construire l'application NestJS
RUN pnpm build

# Étape 2 : Image finale
FROM node:20-alpine

WORKDIR /app

# Installer pnpm à nouveau
RUN npm install -g pnpm

# Copier uniquement les fichiers nécessaires depuis l'étape de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json .
COPY --from=builder /app/pnpm-lock.yaml .
COPY --from=builder /app/node_modules ./node_modules

# Démarrer l'application
CMD ["node", "dist/src/main"]
