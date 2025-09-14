import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(__dirname, '../../data/digiration.db');
const dbDir = path.dirname(dbPath);

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new sqlite3.Database(dbPath);

export async function initializeDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Ration cards table
      db.run(`
        CREATE TABLE IF NOT EXISTS ration_cards (
          id TEXT PRIMARY KEY,
          family_name TEXT NOT NULL,
          mobile_number TEXT NOT NULL,
          address TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Family members table
      db.run(`
        CREATE TABLE IF NOT EXISTS family_members (
          id TEXT PRIMARY KEY,
          ration_card_id TEXT NOT NULL,
          name TEXT NOT NULL,
          age INTEGER NOT NULL,
          gender TEXT NOT NULL,
          relation TEXT NOT NULL,
          is_verified BOOLEAN DEFAULT FALSE,
          verification_status TEXT DEFAULT 'not_verified',
          government_id TEXT,
          government_id_type TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (ration_card_id) REFERENCES ration_cards (id)
        )
      `);

      // OTP verification table
      db.run(`
        CREATE TABLE IF NOT EXISTS otp_verifications (
          id TEXT PRIMARY KEY,
          ration_card_id TEXT NOT NULL,
          mobile_number TEXT NOT NULL,
          otp TEXT NOT NULL,
          expires_at DATETIME NOT NULL,
          is_used BOOLEAN DEFAULT FALSE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (ration_card_id) REFERENCES ration_cards (id)
        )
      `);

      // Ration items table
      db.run(`
        CREATE TABLE IF NOT EXISTS ration_items (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          unit TEXT NOT NULL,
          price_per_unit REAL NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Shop stock table
      db.run(`
        CREATE TABLE IF NOT EXISTS shop_stock (
          id TEXT PRIMARY KEY,
          item_id TEXT NOT NULL,
          quantity REAL NOT NULL,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (item_id) REFERENCES ration_items (id)
        )
      `);

      // User quotas table
      db.run(`
        CREATE TABLE IF NOT EXISTS user_quotas (
          id TEXT PRIMARY KEY,
          member_id TEXT NOT NULL,
          item_id TEXT NOT NULL,
          monthly_quota REAL NOT NULL,
          used_quota REAL DEFAULT 0,
          month_year TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (member_id) REFERENCES family_members (id),
          FOREIGN KEY (item_id) REFERENCES ration_items (id)
        )
      `);

      // Transactions table
      db.run(`
        CREATE TABLE IF NOT EXISTS transactions (
          id TEXT PRIMARY KEY,
          member_id TEXT NOT NULL,
          item_id TEXT NOT NULL,
          quantity REAL NOT NULL,
          amount REAL NOT NULL,
          shop_id TEXT NOT NULL,
          status TEXT DEFAULT 'pending',
          qr_code TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (member_id) REFERENCES family_members (id),
          FOREIGN KEY (item_id) REFERENCES ration_items (id)
        )
      `);

      // Insert sample data
      insertSampleData();

      console.log('✅ Database initialized successfully');
      resolve();
    });

    db.on('error', (err) => {
      console.error('Database error:', err);
      reject(err);
    });
  });
}

function insertSampleData() {
  // Sample ration card
  db.run(`
    INSERT OR IGNORE INTO ration_cards (id, family_name, mobile_number, address)
    VALUES ('RC32165487', 'Kumar Family', '9876543210', '123 Main Street, Mumbai, Maharashtra')
  `);

  // Sample family members
  const members = [
    ['M001', 'RC32165487', 'Rajesh Kumar', 45, 'M', 'Head of Family', true, 'verified'],
    ['M002', 'RC32165487', 'Priya Kumar', 42, 'F', 'Spouse', false, 'pending'],
    ['M003', 'RC32165487', 'Arjun Kumar', 18, 'M', 'Son', false, 'not_verified'],
    ['M004', 'RC32165487', 'Meera Kumar', 15, 'F', 'Daughter', false, 'not_verified'],
  ];

  members.forEach(([id, rationCardId, name, age, gender, relation, isVerified, verificationStatus]) => {
    db.run(`
      INSERT OR IGNORE INTO family_members 
      (id, ration_card_id, name, age, gender, relation, is_verified, verification_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, rationCardId, name, age, gender, relation, isVerified, verificationStatus]);
  });

  // Sample ration items
  const items = [
    ['I001', 'Rice (Basmati)', 'kg', 45.00],
    ['I002', 'Wheat (Whole)', 'kg', 25.00],
    ['I003', 'Cooking Oil', 'L', 120.00],
    ['I004', 'Salt (Iodized)', 'kg', 20.00],
    ['I005', 'Sugar', 'kg', 40.00],
  ];

  items.forEach(([id, name, unit, price]) => {
    db.run(`
      INSERT OR IGNORE INTO ration_items (id, name, unit, price_per_unit)
      VALUES (?, ?, ?, ?)
    `, [id, name, unit, price]);
  });

  // Sample shop stock
  const stock = [
    ['S001', 'I001', 50.0],
    ['S002', 'I002', 30.0],
    ['S003', 'I003', 0.0],
    ['S004', 'I004', 25.0],
    ['S005', 'I005', 15.0],
  ];

  stock.forEach(([id, itemId, quantity]) => {
    db.run(`
      INSERT OR IGNORE INTO shop_stock (id, item_id, quantity)
      VALUES (?, ?, ?)
    `, [id, itemId, quantity]);
  });

  // Sample user quotas (for current month)
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
  const quotas = [
    ['Q001', 'M001', 'I001', 10.0, 7.0, currentMonth],
    ['Q002', 'M001', 'I002', 8.0, 8.0, currentMonth],
    ['Q003', 'M001', 'I003', 2.0, 0.0, currentMonth],
    ['Q004', 'M001', 'I004', 1.0, 0.5, currentMonth],
    ['Q005', 'M001', 'I005', 1.0, 0.0, currentMonth],
  ];

  quotas.forEach(([id, memberId, itemId, monthlyQuota, usedQuota, monthYear]) => {
    db.run(`
      INSERT OR IGNORE INTO user_quotas 
      (id, member_id, item_id, monthly_quota, used_quota, month_year)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [id, memberId, itemId, monthlyQuota, usedQuota, monthYear]);
  });

  console.log('📊 Sample data inserted');
}
