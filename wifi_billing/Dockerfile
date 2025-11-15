# ---------------------------------------
# 1. Build Next.js frontend
# ---------------------------------------
FROM node:18-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
RUN npm run build

# ---------------------------------------
# 2. Setup backend with frontend build
# ---------------------------------------
FROM node:18-alpine AS backend
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
RUN npm install --production && npx prisma generate

# Copy all backend files
COPY . .

# Copy Next.js build output to backend
COPY --from=frontend /app/frontend/.next ./frontend/.next
COPY --from=frontend /app/frontend/public ./frontend/public
COPY --from=frontend /app/frontend/package.json ./frontend/

# ---------------------------------------
# 3. Run the integrated server
# ---------------------------------------
EXPOSE 5000
CMD ["node", "server.js"]