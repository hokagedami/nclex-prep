#!/usr/bin/env node

/**
 * Database Migration Script
 * Handles migrations for both SQLite and PostgreSQL
 *
 * Usage:
 *   node scripts/db-migrate.js init       # Initialize new database
 *   node scripts/db-migrate.js deploy     # Deploy migrations
 *   node scripts/db-migrate.js reset      # Reset database (DANGER!)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const command = process.argv[2];
const dbProvider = process.env.DATABASE_PROVIDER || 'sqlite';

console.log(`🗄️  Database Provider: ${dbProvider.toUpperCase()}`);

function runCommand(cmd, description) {
  console.log(`\n⚙️  ${description}...`);
  try {
    execSync(cmd, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    console.log(`✅ ${description} completed`);
  } catch (error) {
    console.error(`❌ ${description} failed`);
    process.exit(1);
  }
}

switch (command) {
  case 'init':
    console.log('🚀 Initializing database...');
    runCommand('npx prisma generate', 'Generating Prisma Client');
    runCommand('npx prisma db push', 'Creating database schema');
    console.log('\n✅ Database initialized successfully!');
    console.log('💡 Run "npm run seed" to populate with test data');
    break;

  case 'deploy':
    console.log('🚀 Deploying migrations...');
    runCommand('npx prisma generate', 'Generating Prisma Client');

    // Check if migration files exist
    const migrationsPath = path.join(__dirname, '..', 'prisma', 'migrations');
    if (fs.existsSync(migrationsPath) && fs.readdirSync(migrationsPath).length > 0) {
      runCommand('npx prisma migrate deploy', 'Deploying migrations');
    } else {
      console.log('ℹ️  No migrations found, using db push instead');
      runCommand('npx prisma db push', 'Pushing schema to database');
    }
    console.log('\n✅ Migrations deployed successfully!');
    break;

  case 'reset':
    console.log('⚠️  WARNING: This will DELETE all data in your database!');
    console.log('Current database:', process.env.DATABASE_URL);
    console.log('\nPress Ctrl+C to cancel, or wait 5 seconds to continue...');

    // Wait 5 seconds
    execSync('timeout 5', { stdio: 'inherit' }).catch(() => {});

    runCommand('npx prisma migrate reset --force', 'Resetting database');
    console.log('\n✅ Database reset successfully!');
    console.log('💡 Run "npm run seed" to populate with test data');
    break;

  case 'studio':
    console.log('🎨 Opening Prisma Studio...');
    runCommand('npx prisma studio', 'Launching Prisma Studio');
    break;

  default:
    console.log('Usage: node scripts/db-migrate.js [init|deploy|reset|studio]');
    console.log('');
    console.log('Commands:');
    console.log('  init    - Initialize a new database');
    console.log('  deploy  - Deploy pending migrations');
    console.log('  reset   - Reset database (WARNING: deletes all data)');
    console.log('  studio  - Open Prisma Studio');
    process.exit(1);
}
