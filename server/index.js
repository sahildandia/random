import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool, { initializeDatabase } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- ROUTES ---

// Get All Upcoming Events
app.get('/api/upcoming-events', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM upcoming_events ORDER BY id DESC');
    // Map snake_case to camelCase for frontend compatibility
    const events = rows.map(event => ({
        id: event.id,
        title: event.title,
        date: event.date,
        location: event.location,
        description: event.description,
        image: event.image,
        dateTarget: event.date_target,
        registrationLink: event.registration_link
    }));
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Add Upcoming Event (Admin)
app.post('/api/upcoming-events', async (req, res) => {
  const { title, date, location, description, image, dateTarget, registrationLink } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO upcoming_events (title, date, location, description, image, date_target, registration_link) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, date, location, description, image, dateTarget, registrationLink]
    );
    const event = rows[0];
    res.json({
        id: event.id,
        title: event.title,
        date: event.date,
        location: event.location,
        description: event.description,
        image: event.image,
        dateTarget: event.date_target,
        registrationLink: event.registration_link
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Delete Upcoming Event
app.delete('/api/upcoming-events/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM upcoming_events WHERE id = $1', [req.params.id]);
        res.json({ message: 'Deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


// Get Past Events
app.get('/api/past-events', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM past_events ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Register Participant
app.post('/api/register', async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'name, email and phone are required' });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO participants (name, email, phone) VALUES ($1, $2, $3) RETURNING *',
      [name, email, phone]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get all participants (for admin portal)
app.get('/api/participants', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM participants ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server due to database error:', err);
    process.exit(1);
  }
};

startServer();
