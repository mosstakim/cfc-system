import { useState, useEffect } from 'react';
import api from '../services/api';

interface Formation {
    id: string;
    title: string;
    description: string;
    tuitionFees: number;
    duration: string;
    establishmentId: string;
}

interface Establishment {
    id: string;
    name: string;
}

export default function FormationManagement() {
    const [formations, setFormations] = useState<Formation[]>([]);
    const [establishments, setEstablishments] = useState<Establishment[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentFormation, setCurrentFormation] = useState<Partial<Formation>>({});
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await api.get('/academic');
            // Assuming res.data contains { formations: [], establishments: [], sessions: [] }
            setFormations(res.data.formations || []);
            setEstablishments(res.data.establishments || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette formation ?")) {
            try {
                await api.delete(`/academic/formations/${id}`);
                setFormations(formations.filter(f => f.id !== id));
            } catch (error) {
                console.error("Error deleting formation:", error);
                alert("Erreur lors de la suppression");
            }
        }
    };

    const handleEdit = (formation: Formation) => {
        setCurrentFormation(formation);
        setIsEditing(true);
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && currentFormation.id) {
                await api.patch(`/academic/formations/${currentFormation.id}`, currentFormation);
            } else {
                await api.post('/academic/formations', currentFormation);
            }
            setShowForm(false);
            setIsEditing(false);
            setCurrentFormation({});
            fetchData(); // Refresh list
        } catch (error) {
            console.error("Error saving formation:", error);
            alert("Erreur lors de l'enregistrement");
        }
    };

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Gestion des Formations</h3>
                <button
                    className="btn"
                    onClick={() => {
                        setShowForm(!showForm);
                        setIsEditing(false);
                        setCurrentFormation({});
                    }}
                >
                    {showForm ? 'Annuler' : 'Nouvelle Formation'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
                    <div className="form-group">
                        <label>Titre</label>
                        <input
                            type="text"
                            value={currentFormation.title || ''}
                            onChange={e => setCurrentFormation({ ...currentFormation, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={currentFormation.description || ''}
                            onChange={e => setCurrentFormation({ ...currentFormation, description: e.target.value })}
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                        />
                    </div>
                    <div className="form-group">
                        <label>Frais de scolarité (DH)</label>
                        <input
                            type="number"
                            value={currentFormation.tuitionFees || ''}
                            onChange={e => setCurrentFormation({ ...currentFormation, tuitionFees: Number(e.target.value) })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Durée</label>
                        <input
                            type="text"
                            value={currentFormation.duration || ''}
                            onChange={e => setCurrentFormation({ ...currentFormation, duration: e.target.value })}
                            placeholder="ex: 12 mois"
                        />
                    </div>
                    <div className="form-group">
                        <label>Établissement</label>
                        <select
                            value={currentFormation.establishmentId || ''}
                            onChange={e => setCurrentFormation({ ...currentFormation, establishmentId: e.target.value })}
                            required
                        >
                            <option value="">Sélectionner un établissement</option>
                            {establishments.map(est => (
                                <option key={est.id} value={est.id}>{est.name}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="btn">{isEditing ? 'Mettre à jour' : 'Créer'}</button>
                </form>
            )}

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#f3f4f6', textAlign: 'left' }}>
                        <th style={{ padding: '0.5rem' }}>Titre</th>
                        <th style={{ padding: '0.5rem' }}>Frais</th>
                        <th style={{ padding: '0.5rem' }}>Établissement</th>
                        <th style={{ padding: '0.5rem' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {formations.map(formation => (
                        <tr key={formation.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <td style={{ padding: '0.5rem' }}>{formation.title}</td>
                            <td style={{ padding: '0.5rem' }}>{formation.tuitionFees} DH</td>
                            <td style={{ padding: '0.5rem' }}>
                                {establishments.find(e => e.id === formation.establishmentId)?.name || 'N/A'}
                            </td>
                            <td style={{ padding: '0.5rem' }}>
                                <button
                                    onClick={() => handleEdit(formation)}
                                    className="btn btn-secondary"
                                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', marginRight: '0.5rem' }}
                                >
                                    Modifier
                                </button>
                                <button
                                    onClick={() => handleDelete(formation.id)}
                                    className="btn btn-danger"
                                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                                >
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
