import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

interface Formation {
    id: string;
    title: string;
    description: string;
    tuitionFees: string;
    sessions: { id: string; name: string; isOpen: boolean }[];
}

function Home() {
    const [formations, setFormations] = useState<Formation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/academic');
                // Backend returns: { establishments: [], formations: [], sessions: [] }
                setFormations(response.data.formations || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Chargement...</div>;

    return (
        <div className="home-page">
            <h1>Bienvenue sur le portail d'inscription CFC</h1>
            <p>Sélectionnez une formation pour vous inscrire :</p>

            <div className="formations-list">
                {formations.map((formation) => (
                    <div key={formation.id} className="card">
                        <h2>{formation.title}</h2>
                        <p>{formation.description}</p>
                        <p><strong>Frais de scolarité :</strong> {formation.tuitionFees} DH</p>

                        <h3>Sessions disponibles :</h3>
                        <ul>
                            {formation.sessions?.map(session => (
                                <li key={session.id}>
                                    {session.name} {session.isOpen ? '(Ouverte)' : '(Fermée)'}
                                    {session.isOpen && (
                                        <Link to={`/register?sessionId=${session.id}`} className="btn" style={{ marginLeft: '10px' }}>
                                            S'inscrire
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
