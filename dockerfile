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
# These make docker run --rm henckels-tests work without additional -e flags
ENV CI=true
ENV HEADLESS=true
ENV NODE_ENV=staging
ENV BROWSER=chromium
ENV SCREEN_SIZE=desktop
ENV COUNTRY=us

# Add debugging information
RUN echo "=== Docker Environment Info ===" && \
    node --version && \
    npm --version && \
    npx playwright --version && \
    echo "========================="

# Create output directories
RUN mkdir -p output reports

CMD ["npm", "run", "test:poc:headless"]