FROM mcr.microsoft.com/playwright:v1.40.0-focal

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx playwright install

# ⬅️ ДОДАЙТЕ ЦЮ ДІАГНОСТИКУ
RUN echo "=== Docker Environment Info ===" && \
    node --version && \
    npm --version && \
    npx playwright --version && \
    echo "========================="

RUN mkdir -p output reports

CMD ["npm", "run", "test:poc"]