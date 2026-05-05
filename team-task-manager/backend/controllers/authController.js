const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

// Generate JWT Token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // 1. Check if user already exists
        const { data: existingUser } = await supabase.from('users').select('*').eq('email', email).single();
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // 2. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Insert user into database
        const { data: newUser, error } = await supabase
            .from('users')
            .insert([{ name, email, password: hashedPassword, role: role || 'Member' }])
            .select('id, name, email, role') // Don't return the password!
            .single();

        if (error) throw error;

        // 4. Send response with token
        res.status(201).json({
            message: 'User created successfully',
            user: newUser,
            token: generateToken(newUser.id, newUser.role)
        });

    } catch (error) {
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user by email
        const { data: user, error } = await supabase.from('users').select('*').eq('email', email).single();
        
        if (error || !user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // 2. Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // 3. Send response with token
        res.status(200).json({
            message: 'Login successful',
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
            token: generateToken(user.id, user.role)
        });

    } catch (error) {
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};