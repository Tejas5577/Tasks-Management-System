import { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Member' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/auth/signup', formData);
            navigate('/'); // Redirect to login after successful signup
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed');
        }
    };

    return (
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            
            {/* BRANDED TITLE SECTION */}
            <div className="text-center mb-4">
                <h1 className="fw-bold mb-1" style={{ 
                    background: 'linear-gradient(to right, var(--purple-faint), var(--pink-soft))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: '2.8rem',
                    letterSpacing: '-1.5px'
                }}>
                    Task Management System
                </h1>
                <p style={{ color: 'black', fontSize: '1.2rem', opacity: '0.8' }}>
                    Join us to start managing your tasks efficiently.
                </p>
            </div>

            {/* SIGNUP CARD */}
            <Card style={{ width: '450px' }} className="card shadow-lg">
                <Card.Body className="p-4">
                    <h3 className="text-center mb-4 fw-bold" style={{ color: 'white' }}>Create Account</h3>
                    
                    {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
                    
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>Full Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="John Doe" 
                                className="bg-dark text-white border-secondary"
                                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                required 
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>Email Address</Form.Label>
                            <Form.Control 
                                type="email" 
                                placeholder="email@example.com" 
                                className="bg-dark text-white border-secondary"
                                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                required 
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Min 6 characters" 
                                className="bg-dark text-white border-secondary"
                                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                required 
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>Account Role</Form.Label>
                            <Form.Select 
                                className="bg-dark text-white border-secondary"
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                                value={formData.role}
                            >
                                <option value="Member">Member (View & Update Tasks)</option>
                                <option value="Admin">Admin (Full Control)</option>
                            </Form.Select>
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100 btn-primary py-2 fw-bold">
                            Create Account
                        </Button>
                    </Form>

                    <div className="text-center mt-4" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Already have an account? <Link to="/" style={{ color: 'var(--pink-soft)', fontWeight: '600', textDecoration: 'none' }}>Login here</Link>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Signup;