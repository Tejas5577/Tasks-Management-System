const supabase = require('../config/supabase');

// @desc    Create a new project (Admin Only)
exports.createProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        
        // Basic Validation
        if (!name) return res.status(400).json({ error: 'Project name is required' });

        const { data, error } = await supabase
            .from('projects')
            .insert([{ name, description, created_by: req.user.id }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create project', details: error.message });
    }
};

// @desc    Get all projects
exports.getProjects = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select(`*, users(name)`); // Joining with users table to see who created it

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects', details: error.message });
    }
};