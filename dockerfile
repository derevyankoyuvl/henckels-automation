FROM mcr.microsoft.com/playwright:v1.40.0-focal

WORKDIR /app

# Copy package files first
COPY package*.json ./
RUN npm ci

# Copy all project files
COPY . .

# Install Playwright browsers
RUN npx playwright install

# Set default environment variables for containerized execution
ENV CI=true
ENV HEADLESS=true
ENV NODE_ENV=staging
ENV BROWSER=chromium
ENV SCREEN_SIZE=desktop
ENV COUNTRY=us

# Comprehensive debugging information
RUN echo "=== Docker Environment Info ===" && \
    node --version && \
    npm --version && \
    npx playwright --version && \
    echo "=========================" && \
    echo "=== Project Root Structure ===" && \
    ls -la /app/ && \
    echo "=========================" && \
    echo "=== Pages Directory Check ===" && \
    ls -la /app/pages/ 2>/dev/null || echo "❌ ERROR: Pages directory not found!" && \
    echo "=========================" && \
    echo "=== All JavaScript Files ===" && \
    find /app -name "*.js" | grep -v node_modules | head -20 && \
    echo "=========================" && \
    echo "=== CodeceptJS Config Check ===" && \
    cat /app/codecept.conf.js | grep -A 10 -B 5 "include" 2>/dev/null || echo "codecept.conf.js not found or no include section" && \
    echo "========================="

# Create output directories
RUN mkdir -p output reports

CMD ["npm", "run", "test:poc:headless"]