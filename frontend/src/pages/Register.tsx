import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Register() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const sessionId = searchParams.get('sessionId') || '';

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        sessionId: sessionId
    });

    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            // 1. Create User (Candidate)
            const userResponse = await api.post('/users', {
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                role: 'CANDIDATE' // user-role enum match
            });

            const candidateId = userResponse.data.id;

            // 2. Auto-Login to get Token
            const loginResponse = await api.post('/auth/login', {
                email: formData.email,
                password: formData.password
            });
            const { access_token, user } = loginResponse.data;
            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(user));

            // 3. Register to Session (Token is now auto-injected by interceptor)
            await api.post('/registration', {
                candidateId,
                sessionId: formData.sessionId
            });

            setStatus('success');
            setMessage('Inscription réussie ! Vous pouvez maintenant vous connecter.');
            setTimeout(() => navigate('/'), 3000); // Redirect to home

        } catch (error: any) {
            console.error(error);
            setStatus('error');
            setMessage(error.response?.data?.message || "L'inscription a échoué");
        }
    };

    const [sessionDetails, setSessionDetails] = useState<any>(null);

    const [allSessions, setAllSessions] = useState<any[]>([]);

    useEffect(() => {
        // Fetch formations to get sessions WITH formation details (since direct session fetch has formation excluded)
        api.get('/academic').then((response: any) => {
            const formations = response.data.formations || [];
            const flatSessions: any[] = [];

            formations.forEach((formation: any) => {
                if (formation.sessions) {
                    formation.sessions.forEach((session: any) => {
                        // Manually attach formation details to session for display
                        const enrichedSession = {
                            ...session,
                            formation: {
                                id: formation.id,
                                title: formation.title,
                                tuitionFees: formation.tuitionFees
                            }
                        };
                        flatSessions.push(enrichedSession);
                    });
                }
            });

            // Filter for open sessions only
            const openSessions = flatSessions.filter((s: any) => s.isOpen);
            setAllSessions(openSessions);

            if (sessionId) {
                const session = openSessions.find((s: any) => s.id === sessionId);
                if (session) {
                    setSessionDetails(session);
                }
            }
        }).catch((err: any) => console.error(err));
    }, [sessionId]);

    return (
        <div className="register-page">
            <h1>Inscription Candidat</h1>
            {sessionDetails && (
                <div className="card" style={{ marginBottom: '20px', backgroundColor: '#f0f9ff' }}>
                    <h3>Vous vous inscrivez à :</h3>
                    <p><strong>Formation :</strong> {sessionDetails.formation.title}</p>
                    <p><strong>Session :</strong> {sessionDetails.name}</p>
                    <p><strong>Frais :</strong> {sessionDetails.formation.tuitionFees} DH</p>
                </div>
            )
            }

            {status === 'success' ? (
                <div className="card" style={{ backgroundColor: '#d1fae5' }}>
                    <h3>{message}</h3>
                    <p>Redirection vers l'accueil...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
                    {status === 'error' && <p style={{ color: 'red' }}>{message}</p>}

                    <div className="form-group">
                        <label>Prénom</label>
                        <input
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Nom</label>
                        <input
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>



                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Mot de passe</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Session</label>
                        <select
                            name="sessionId"
                            value={formData.sessionId}
                            onChange={handleChange}
                            required
                            className="form-control"
                            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
                        >
                            <option value="">-- Sélectionner une session --</option>
                            {allSessions.map((session: any) => (
                                <option key={session.id} value={session.id}>
                                    {session.formation.title} - {session.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="btn" disabled={status === 'submitting'}>
                        {status === 'submitting' ? 'Inscription en cours...' : "S'inscrire"}
                    </button>
                </form>
            )}
        </div>
    );
}

export default Register;
