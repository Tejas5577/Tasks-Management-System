import { useState, useContext } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/auth/login', { email, password });
            login(data.user, data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
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
                    Sign in to manage your projects efficiently.
                </p>
            </div>

            {/* LOGIN CARD */}
            <Card style={{ width: '400px' }} className="card shadow-lg">
                <Card.Body className="p-4">
                    <h3 className="text-center mb-4 fw-bold" style={{ color: 'white' }}>Login</h3>
                    
                    {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
                    
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>Email Address</Form.Label>
                            <Form.Control 
                                type="email" 
                                placeholder="name@example.com" 
                                className="bg-dark text-white border-secondary"
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Enter your password" 
                                className="bg-dark text-white border-secondary"
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100 btn-primary py-2 fw-bold">
                            Login
                        </Button>
                    </Form>

                    <div className="text-center mt-4" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        New user? <Link to="/signup" style={{ color: 'var(--pink-soft)', fontWeight: '600', textDecoration: 'none' }}>Signup here</Link>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Login;