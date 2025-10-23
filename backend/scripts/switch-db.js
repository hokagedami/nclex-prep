#!/usr/bin/env node

/**
 * Database Switcher Script
 * Switches between SQLite and PostgreSQL by updating .env file
 *
 * Usage:
 *   node scripts/switch-db.js sqlite
 *   node scripts/switch-db.js postgresql
 */

const fs = require('fs');
const path = require('path');

const dbType = process.argv[2];

if (!dbType || !['sqlite', 'postgresql'].includes(dbType)) {
  console.error('❌ Invalid database type. Use "sqlite" or "postgresql"');
  console.log('Usage: node scripts/switch-db.js [sqlite|postgresql]');
  process.exit(1);
}

const envPath = path.join(__dirname, '..', '.env');
const templatePath = path.join(__dirname, '..', `.env.${dbType}`);
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');

try {
  // Check if template exists
  if (!fs.existsSync(templatePath)) {
    console.error(`❌ Template file not found: .env.${dbType}`);
    process.exit(1);
  }

  // Read template
  const template = fs.readFileSync(templatePath, 'utf8');

  // Backup current .env
  if (fs.existsSync(envPath)) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(__dirname, '..', `.env.backup.${timestamp}`);
    fs.copyFileSync(envPath, backupPath);
    console.log(`📦 Backed up current .env to: .env.backup.${timestamp}`);
  }

  // Write new .env
  fs.writeFileSync(envPath, template);
  console.log(`✅ Switched to ${dbType.toUpperCase()}`);
  console.log(`📝 Updated .env file`);

  // Update schema.prisma provider
  if (fs.existsSync(schemaPath)) {
    let schema = fs.readFileSync(schemaPath, 'utf8');
    const newProvider = dbType === 'postgresql' ? 'postgresql' : 'sqlite';

    // Replace provider line
    schema = schema.replace(
      /provider\s*=\s*"(sqlite|postgresql)"/,
      `provider = "${newProvider}"`
    );

    fs.writeFileSync(schemaPath, schema);
    console.log(`📝 Updated schema.prisma provider to: ${newProvider}`);
  }

  console.log('\n🔄 Next steps:');
  if (dbType === 'postgresql') {
    console.log('1. Regenerate Prisma Client: npx prisma generate');
    console.log('2. Start PostgreSQL: docker-compose --profile postgres up -d');
    console.log('   Or use: npm run docker:up:postgres');
    console.log('3. Initialize database: npm run db:init');
    console.log('4. Seed database: npm run db:seed');
    console.log('5. Start application: npm run dev');
  } else {
    console.log('1. Regenerate Prisma Client: npx prisma generate');
    console.log('2. Run migrations: npx prisma migrate deploy');
    console.log('3. Seed database: npm run seed');
    console.log('4. Start application: npm run dev');
  }
} catch (error) {
  console.error('❌ Error switching database:', error.message);
  process.exit(1);
}
