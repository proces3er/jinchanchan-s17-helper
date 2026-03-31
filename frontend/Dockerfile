FROM node:20-alpine

WORKDIR /app

# Copy dependency manifests first to leverage Docker layer cache
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./ 2>/dev/null || true

RUN npm install

# Copy application source code
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

