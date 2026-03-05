import pool from './db.js';

const createTables = async () => {
  try {
    console.log('Creating tables...');

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
    await pool.query(`
      CREATE TABLE IF NOT EXISTS participants (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Tables created successfully.');
    
    // Seed Data Check
    const { rows } = await pool.query('SELECT COUNT(*) FROM upcoming_events');
    if (parseInt(rows[0].count) === 0) {
       console.log('Seeding initial data...');
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

    process.exit(0);
  } catch (err) {
    console.error('Error setting up database:', err);
    process.exit(1);
  }
};

createTables();
