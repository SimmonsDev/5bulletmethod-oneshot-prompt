const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Initialize the database
function initializeDatabase() {
    const dbPath = path.join(__dirname, '5bulletmethod.db');
    
    // Remove existing database if it exists
    if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
        console.log('Removed existing database');
    }
    
    // Create new database
    const db = new Database(dbPath);
    console.log('Created new database at', dbPath);
    
    // Read and execute schema
    const schemaSQL = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    db.exec(schemaSQL);
    console.log('Schema created successfully');
    
    db.close();
}

// Seed the database with sample data
function seedDatabase() {
    const dbPath = path.join(__dirname, '5bulletmethod.db');
    const db = new Database(dbPath);
    
    // Read and execute seed data
    const seedSQL = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
    db.exec(seedSQL);
    console.log('Database seeded successfully');
    
    db.close();
}

// Check if script is run directly
if (require.main === module) {
    const command = process.argv[2];
    
    if (command === 'init') {
        initializeDatabase();
    } else if (command === 'seed') {
        seedDatabase();
    } else if (command === 'reset') {
        initializeDatabase();
        seedDatabase();
    } else {
        console.log('Usage: node setup.js [init|seed|reset]');
        console.log('  init  - Initialize empty database');
        console.log('  seed  - Add sample data to existing database');
        console.log('  reset - Initialize and seed database');
    }
}

module.exports = { initializeDatabase, seedDatabase };
