require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Team Task Manager API is running.');
});

// --- ROUTES ---
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);


const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'success', 
        message: 'Server is healthy and ready to accept requests.' 
    });
});


const supabase = require('./config/supabase');

// Test Database Connection Route
app.get('/api/test-db', async (req, res) => {
    const { data, error } = await supabase.from('users').select('*').limit(1);
    
    if (error) {
        return res.status(500).json({ error: 'Database connection failed', details: error.message });
    }
    
    res.status(200).json({ message: 'Database connected successfully!', data });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});