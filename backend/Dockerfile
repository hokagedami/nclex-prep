# Backend Dockerfile
FROM node:18-alpine

# Build argument for database provider (sqlite or postgresql)
ARG DB_PROVIDER=sqlite

WORKDIR /app

# Copy all files first
COPY . .

# Switch database provider in schema.prisma if needed
RUN if [ "$DB_PROVIDER" = "postgresql" ]; then \
      sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma; \
    fi

# Install dependencies
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Run migrations and start server
# Use db push for initial setup (works with both SQLite and PostgreSQL)
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && npm start"]
