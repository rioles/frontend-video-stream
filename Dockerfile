# --- Étape 1 : Construction du projet (Builder) ---
# Changement ici pour correspondre à ta version v20
FROM node:20-alpine AS builder
WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./
RUN npm ci

# Copie du reste du code source
COPY . .

# Désactive la télémétrie Next.js pendant le build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Déclenche le build
RUN npm run build

# --- Étape 2 : Serveur de Production (Runner) ---
# Alignement sur Node.js 20 ici aussi
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Sécurité (Zero-Trust)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Récupération des assets nécessaires
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Changement d'utilisateur pour la sécurité
USER nextjs

EXPOSE 3000

# Démarrage de l'application standalone
CMD ["node", "server.js"]
