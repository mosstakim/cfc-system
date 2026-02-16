import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (err: any) {
            console.error(err);
            if (err.response) {
                setError(`Échec de la connexion : ${err.response.status} ${err.response.statusText}`);
            } else if (err.request) {
                setError('Erreur réseau : Pas de réponse du serveur');
            } else {
                setError(`Erreur : ${err.message}`);
            }
        }
    };

    return (
        <div className="login-page">
            <h1>Connexion</h1>
            <form onSubmit={handleSubmit} className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Mot de passe</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn">Se connecter</button>
            </form>
        </div>
    );
}

export default Login;
