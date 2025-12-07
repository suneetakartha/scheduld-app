FROM node:18

WORKDIR /app

# Copy package.json etc.
COPY package*.json ./
RUN npm install --production

# Copy your monorepo code
COPY . .

# If your app entry is in src/server.ts or src/index.ts,
# make sure your build scripts handle that (e.g., `npm run build`).
# For now, assume a plain JS server at src/server.js:
EXPOSE 3000

CMD ["node", "src/server.js"]
