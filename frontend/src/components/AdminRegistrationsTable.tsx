import { useEffect, useState } from 'react';
import api from '../services/api';

interface Registration {
    id: string;
    candidate: {
        firstName: string;
        lastName: string;
        email: string;
    };
    session: {
        id: string;
        name: string;
        formation?: {
            title: string;
        };
    };
    status: 'PENDING' | 'VALIDATED' | 'REJECTED';
    dossier: {
        id: string;
        isComplete: boolean;
        documents: Record<string, string>;
    };
}

interface Props {
    establishmentId?: string;
}

function AdminRegistrationsTable({ establishmentId }: Props) {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [formationMap, setFormationMap] = useState<Record<string, string>>({});

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [regRes, academicRes] = await Promise.all([
                api.get('/registration', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                api.get('/academic')
            ]);

            setRegistrations(regRes.data);

            // Build map of sessionId -> formationTitle and sessionId -> establishmentId
            const formations = academicRes.data.formations || [];
            const tempMap: Record<string, string> = {};
            const sessionEstMap: Record<string, string> = {};

            formations.forEach((f: any) => {
                f.sessions?.forEach((s: any) => {
                    tempMap[s.id] = f.title;
                    sessionEstMap[s.id] = f.establishmentId;
                });
            });
            setFormationMap(tempMap);

            let regs = regRes.data;
            if (establishmentId) {
                regs = regs.filter((r: any) => sessionEstMap[r.session.id] === establishmentId);
            }
            setRegistrations(regs);

            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch data', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const token = localStorage.getItem('token');
            await api.patch(`/registration/${id}`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Refresh list or update local state
            setRegistrations(prev => prev.map(reg =>
                reg.id === id ? { ...reg, status: newStatus as any } : reg
            ));
        } catch (error) {
            console.error('Failed to update status', error);
            alert('Impossible de mettre à jour le statut');
        }
    };



    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(registrations.map(r => r.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(pid => pid !== id));
        }
    };

    const handleBulkEmail = async (type: 'confirmation' | 'validation') => {
        if (selectedIds.length === 0) return;
        if (!window.confirm(`Envoyer l'email de ${type} à ${selectedIds.length} candidats ?`)) return;

        try {
            const token = localStorage.getItem('token');
            await api.post('/registration/bulk-email', { ids: selectedIds, type }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Emails envoyés (traitement en cours)');
            setSelectedIds([]);
        } catch (error: any) {
            alert('Erreur: ' + (error.response?.data?.message || 'Erreur inconnue'));
        }
    };

    const handleSendEmail = async (id: string, type: 'confirmation' | 'validation') => {
        if (!window.confirm(`Voulez-vous envoyer l'email de ${type === 'confirmation' ? 'confirmation' : 'validation'} ?`)) return;
        try {
            const token = localStorage.getItem('token');
            await api.post(`/registration/${id}/email`, { type }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Email envoyé avec succès');
        } catch (error: any) {
            console.error('Failed to send email', error);
            alert('Erreur: ' + (error.response?.data?.message || 'Erreur inconnue'));
        }
    };

    const handleExport = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get('/reporting/registrations/export', {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `candidats_cfc_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Export failed', error);
            alert('Erreur lors de l\'export');
        }
    };



    const [filterFormation, setFilterFormation] = useState<string>('');
    // Use the map to get titles
    const uniqueFormations = Array.from(new Set(registrations.map(r => formationMap[r.session.id] || 'Autre')));

    const filteredRegistrations = registrations.filter(reg => {
        if (!filterFormation) return true;
        const title = formationMap[reg.session.id] || 'Autre';
        return title === filterFormation;
    });

    if (loading) return <p>Chargement des inscriptions...</p>;

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <h2>Inscriptions Candidats</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <select
                        value={filterFormation}
                        onChange={(e) => setFilterFormation(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="">Toutes les filières</option>
                        {uniqueFormations.map(f => (
                            <option key={f} value={f}>{f}</option>
                        ))}
                    </select>

                    {selectedIds.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <span style={{ alignSelf: 'center', fontSize: '0.9rem', fontWeight: 'bold' }}>{selectedIds.length} sélectionné(s)</span>
                            <button onClick={() => handleBulkEmail('confirmation')} className="btn" style={{ background: '#3b82f6', fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>
                                Email Conf.
                            </button>
                            <button onClick={() => handleBulkEmail('validation')} className="btn" style={{ background: '#059669', fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>
                                Email Valid.
                            </button>
                        </div>
                    )}
                    <button onClick={handleExport} className="btn" style={{ background: '#8b5cf6', fontSize: '0.9rem' }}>Exporter CSV</button>
                    <button onClick={fetchData} className="btn" style={{ background: '#3b82f6', fontSize: '0.9rem' }}>Actualiser</button>
                </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                        <th style={{ padding: '0.5rem' }}>
                            <input
                                type="checkbox"
                                onChange={handleSelectAll}
                                checked={filteredRegistrations.length > 0 && selectedIds.length === filteredRegistrations.length}
                            />
                        </th>
                        <th style={{ padding: '0.5rem' }}>Candidat</th>
                        <th style={{ padding: '0.5rem' }}>Email</th>
                        <th style={{ padding: '0.5rem' }}>Filière / Session</th>
                        <th style={{ padding: '0.5rem' }}>Statut</th>
                        <th style={{ padding: '0.5rem' }}>Dossier</th>
                        <th style={{ padding: '0.5rem' }}>Actions</th>
                        <th style={{ padding: '0.5rem' }}>Notifs</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRegistrations.map(reg => (
                        <tr key={reg.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '0.5rem' }}>
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(reg.id)}
                                    onChange={(e) => handleSelectOne(reg.id, e.target.checked)}
                                />
                            </td>
                            <td style={{ padding: '0.5rem' }}>{reg.candidate.firstName} {reg.candidate.lastName}</td>
                            <td style={{ padding: '0.5rem' }}>{reg.candidate.email}</td>
                            <td style={{ padding: '0.5rem' }}>
                                <strong>{formationMap[reg.session.id] || 'Autre'}</strong><br />
                                <span style={{ fontSize: '0.85rem', color: '#666' }}>{reg.session.name}</span>
                            </td>
                            <td style={{ padding: '0.5rem' }}>
                                <span style={{
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '4px',
                                    backgroundColor: reg.status === 'VALIDATED' ? '#d1fae5' : reg.status === 'REJECTED' ? '#fee2e2' : '#f3f4f6',
                                    color: reg.status === 'VALIDATED' ? '#065f46' : reg.status === 'REJECTED' ? '#991b1b' : '#374151',
                                    fontSize: '0.875rem'
                                }}>
                                    {reg.status}
                                </span>
                            </td>
                            <td style={{ padding: '0.5rem' }}>
                                {reg.dossier?.isComplete ? (
                                    <span style={{ color: 'green' }}>Complet</span>
                                ) : (
                                    <span style={{ color: 'orange' }}>Incomplet</span>
                                )}
                            </td>
                            <td style={{ padding: '0.5rem' }}>
                                {reg.status === 'PENDING' && (
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => handleStatusUpdate(reg.id, 'VALIDATED')}
                                            style={{ padding: '0.25rem 0.5rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Valider
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(reg.id, 'REJECTED')}
                                            style={{ padding: '0.25rem 0.5rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Rejeter
                                        </button>
                                    </div>
                                )}
                                <button
                                    onClick={async () => {
                                        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette inscription ?')) {
                                            try {
                                                const token = localStorage.getItem('token');
                                                await api.delete(`/registration/${reg.id}`, {
                                                    headers: { Authorization: `Bearer ${token}` }
                                                });
                                                setRegistrations(prev => prev.filter(r => r.id !== reg.id));
                                            } catch (err) {
                                                console.error('Delete failed', err);
                                                alert('Erreur lors de la suppression');
                                            }
                                        }
                                    }}
                                    style={{ marginTop: '0.5rem', padding: '0.25rem 0.5rem', background: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' }}
                                >
                                    Supprimer
                                </button>
                                {/* Links to documents */}
                                <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                                    {reg.dossier && reg.dossier.documents && Object.entries(reg.dossier.documents).map(([type, path]) => (
                                        <div key={type}>
                                            <a href={`/uploads/${path}`} target="_blank" rel="noopener noreferrer" style={{ color: 'blue' }}>
                                                Voir {type}
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </td>
                            <td style={{ padding: '0.5rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <button
                                        onClick={() => handleSendEmail(reg.id, 'confirmation')}
                                        style={{ padding: '0.25rem 0.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                                    >
                                        Email Conf.
                                    </button>
                                    {reg.status === 'VALIDATED' && (
                                        <button
                                            onClick={() => handleSendEmail(reg.id, 'validation')}
                                            style={{ padding: '0.25rem 0.5rem', background: '#059669', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                                        >
                                            Email Valid.
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminRegistrationsTable;
