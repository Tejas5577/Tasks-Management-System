const supabase = require('../config/supabase');

// @desc    Create a task (Admin Only)
exports.createTask = async (req, res) => {
    try {
        const { title, description, due_date, project_id, assigned_to } = req.body;

        // Validation
        if (!title || !due_date || !project_id) {
            return res.status(400).json({ error: 'Title, Due Date, and Project ID are required' });
        }

        const { data, error } = await supabase
            .from('tasks')
            .insert([{ title, description, due_date, project_id, assigned_to }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Task creation failed', details: error.message });
    }
};

// @desc    Update task status (Admin & Members)
exports.updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const { data, error } = await supabase
            .from('tasks')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Status update failed', details: error.message });
    }
};

// @desc    Get tasks for a specific project
exports.getProjectTasks = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { data, error } = await supabase
            .from('tasks')
            .select(`*, users(name)`)
            .eq('project_id', projectId);

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks', details: error.message });
    }
};