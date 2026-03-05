import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export const query = (text, params) => pool.query(text, params);

export const initializeDatabase = async () => {
  try {
    console.log('Initializing database and ensuring tables exist...');

    // Upcoming Events Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS upcoming_events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        date VARCHAR(100),
        location VARCHAR(255),
        description TEXT,
        image TEXT,
        date_target VARCHAR(100),
        registration_link VARCHAR(255)
      );
    `);

    // Past Events Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS past_events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        image TEXT
      );
    `);

    // Participants Table
    // Base create in case table does not exist yet
    await pool.query(`
      CREATE TABLE IF NOT EXISTS participants (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        team_name VARCHAR(255),
        registration_number VARCHAR(100),
        members TEXT,
        event VARCHAR(255),
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ensure newer columns exist even if participants table was created earlier
    await pool.query(`ALTER TABLE participants ADD COLUMN IF NOT EXISTS team_name VARCHAR(255);`);
    await pool.query(`ALTER TABLE participants ADD COLUMN IF NOT EXISTS registration_number VARCHAR(100);`);
    await pool.query(`ALTER TABLE participants ADD COLUMN IF NOT EXISTS members TEXT;`);
    await pool.query(`ALTER TABLE participants ADD COLUMN IF NOT EXISTS event VARCHAR(255);`);

    // Seed initial data if needed
    const { rows } = await pool.query('SELECT COUNT(*) FROM upcoming_events');
    if (parseInt(rows[0].count) === 0) {
      console.log('Seeding initial data into database...');

      await pool.query(`
        INSERT INTO upcoming_events (title, date, location, description, image, date_target, registration_link)
        VALUES 
        ('INTELLIX - 5Hrs Challenge', 'January 30, 2026', 'M.Kumaraswamy College of Engineering', 'Mobile App Club powered by ISTE proudly presents 5Hrs INTELLIX. Join us from 10:00am to 3:00pm. Free Entry!', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop', '2026-01-30T10:00:00', 'https://docs.google.com/forms/d/e/1FAIpQLSchApLf-LDBTDihb5Uv3hS2UjoblVZx1ctZkfRjg2X2Y7OWBA/viewform?usp=publish-editor')
      `);

      await pool.query(`
        INSERT INTO past_events (title, image)
        VALUES 
        ('Appathon', 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop'),
        ('AI Workshop', 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop'),
        ('Tech Talk', 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop')
      `);

      console.log('Seed data inserted.');
    }

    console.log('Database initialization complete.');
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  }
};

export default pool;
