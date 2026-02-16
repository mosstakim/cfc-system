import { useState, useEffect } from 'react';
import api from '../services/api';

interface Session {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    isOpen: boolean;
    formation: {
        title: string;
    };
}

function CoordinatorDashboard() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingSession, setEditingSession] = useState<Session | null>(null);
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        isOpen: false
    });

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            // Fetch formations to get sessions AND their formation details (title)
            const res = await api.get('/academic');
            const formations = res.data.formations || [];

            const flatSessions: Session[] = [];

            formations.forEach((formation: any) => {
                if (formation.sessions) {
                    formation.sessions.forEach((session: any) => {
                        // Manually attach formation details
                        const enrichedSession = {
                            ...session,
                            formation: {
                                title: formation.title
                            }
                        };
                        flatSessions.push(enrichedSession);
                    });
                }
            });

            setSessions(flatSessions);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleEditClick = (session: Session) => {
        setEditingSession(session);
        setFormData({
            startDate: session.startDate,
            endDate: session.endDate,
            isOpen: session.isOpen
        });
    };

    const handleCancel = () => {
        setEditingSession(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingSession) return;

        try {
            await api.patch(`/academic/sessions/${editingSession.id}`, formData);
            alert('Session mise à jour avec succès');
            setEditingSession(null);
            fetchSessions(); // Refresh list
        } catch (err) {
            console.error(err);
            alert('Erreur lors de la mise à jour');
        }
    };

    if (loading) return <p>Chargement des sessions...</p>;

    return (
        <div className="card" style={{ marginBottom: '2rem' }}>
            <h2>Gestion des Sessions (Coordinateur)</h2>

            {editingSession ? (
                <form onSubmit={handleSubmit} style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
                    <h3>Modifier : {editingSession.formation.title} - {editingSession.name}</h3>

                    <div className="form-group">
                        <label>Date de début</label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Date de fin</label>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                        <input
                            type="checkbox"
                            name="isOpen"
                            checked={formData.isOpen}
                            onChange={handleChange}
                            style={{ width: 'auto' }}
                        />
                        <label style={{ margin: 0 }}>Inscriptions Ouvertes</label>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" className="btn" style={{ background: '#2563eb' }}>Enregistrer</button>
                        <button type="button" onClick={handleCancel} className="btn" style={{ background: '#9ca3af' }}>Annuler</button>
                    </div>
                </form>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', background: '#f3f4f6' }}>
                                <th style={{ padding: '0.5rem' }}>Formation</th>
                                <th style={{ padding: '0.5rem' }}>Session</th>
                                <th style={{ padding: '0.5rem' }}>Dates</th>
                                <th style={{ padding: '0.5rem' }}>Statut</th>
                                <th style={{ padding: '0.5rem' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.map(s => (
                                <tr key={s.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '0.5rem' }}>{s.formation.title}</td>
                                    <td style={{ padding: '0.5rem' }}>{s.name}</td>
                                    <td style={{ padding: '0.5rem' }}>{s.startDate} au {s.endDate}</td>
                                    <td style={{ padding: '0.5rem' }}>
                                        {s.isOpen ? (
                                            <span style={{ color: 'green', fontWeight: 'bold' }}>OUVERT</span>
                                        ) : (
                                            <span style={{ color: 'red', fontWeight: 'bold' }}>FERMÉ</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '0.5rem' }}>
                                        <button
                                            onClick={() => handleEditClick(s)}
                                            className="btn"
                                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                                        >
                                            Modifier
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default CoordinatorDashboard;
