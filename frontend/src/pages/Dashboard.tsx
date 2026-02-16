import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AdminRegistrationsTable from '../components/AdminRegistrationsTable';
import CoordinatorDashboard from '../components/CoordinatorDashboard';
import UserManagement from '../components/UserManagement';
import FormationManagement from '../components/FormationManagement';

import FileUploader from '../components/FileUploader';

function Dashboard() {
    const [user, setUser] = useState<any>(null);
    const [myRegistration, setMyRegistration] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(userData);

        if (!['SUPER_ADMIN', 'COORDINATOR'].includes(userData.role)) {
            fetchMyRegistration(token);
        }

    }, [navigate]);

    const fetchMyRegistration = async (token: string) => {
        try {
            const [regRes, academicRes] = await Promise.all([
                api.get('/registration/me', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                api.get('/academic')
            ]);

            const registration = regRes.data;
            if (registration && registration.session) {
                // Find formation title
                const formations = academicRes.data.formations || [];
                const formation = formations.find((f: any) =>
                    f.sessions?.some((s: any) => s.id === registration.session.id)
                );

                if (formation) {
                    registration.session.formation = { title: formation.title };
                }
            }

            setMyRegistration(registration);
        } catch (err) {
            console.error(err);
        }
    };

    const handleUploadSuccess = (type: string, filePath: string) => {
        // Optimistic update or refresh
        setMyRegistration((prev: any) => {
            if (!prev) return prev;
            return {
                ...prev,
                dossier: {
                    ...prev.dossier,
                    documents: {
                        ...prev.dossier.documents,
                        [type]: filePath
                    }
                }
            }
        });
        // Re-fetch to get isComplete status updated by backend
        fetchMyRegistration(localStorage.getItem('token') || '');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) return <div>Chargement...</div>;

    return (
        <div className="dashboard-page">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Tableau de bord</h1>
                <button onClick={handleLogout} className="btn" style={{ background: '#ef4444' }}>Déconnexion</button>
            </div>

            <div className="card">
                <h2>Bienvenue, {user.firstName} {user.lastName}</h2>
                <p><strong>Email :</strong> {user.email}</p>
                <p><strong>Rôle :</strong> {user.role}</p>
            </div>

            {user.role === 'SUPER_ADMIN' && (
                <>
                    <AdminRegistrationsTable />
                    <UserManagement />
                    <FormationManagement />
                </>
            )}


            {user.role === 'ADMIN_ETABLISSEMENT' && (
                <>
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem', color: '#1f2937' }}>Gestion : {user.establishment?.name}</h3>
                        <FormationManagement establishmentId={user.establishment?.id} />
                    </div>
                    <div className="card">
                        <h3>Inscriptions à valider</h3>
                        <AdminRegistrationsTable establishmentId={user.establishment?.id} />
                    </div>
                </>
            )}

            {user.role === 'COORDINATOR' && (
                <>
                    <CoordinatorDashboard />
                    <div className="card">
                        <h3>Inscriptions à valider</h3>
                        <AdminRegistrationsTable />
                    </div>
                </>
            )}

            {user.role === 'CANDIDATE' && (
                <div className="card">
                    <h3>Mes inscriptions</h3>
                    {myRegistration ? (
                        <div>
                            <p><strong>Formation :</strong> {myRegistration.session.formation?.title || 'Unknown'}</p>
                            <p><strong>Session :</strong> {myRegistration.session.name}</p>
                            <p><strong>Statut :</strong> <span className={`status-${myRegistration.status.toLowerCase()}`}>{myRegistration.status}</span></p>

                            <hr style={{ margin: '1.5rem 0' }} />

                            <h4>Mon Dossier</h4>
                            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                                Veuillez télécharger les documents requis. Les fichiers seront examinés par l'administration.
                            </p>

                            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                                <FileUploader
                                    label="CV (Curriculum Vitae)"
                                    type="cv"
                                    dossierId={myRegistration.dossier.id}
                                    currentFile={myRegistration.dossier.documents?.cv}
                                    onUploadSuccess={handleUploadSuccess}
                                />
                                <FileUploader
                                    label="Diplôme"
                                    type="diploma"
                                    dossierId={myRegistration.dossier.id}
                                    currentFile={myRegistration.dossier.documents?.diploma}
                                    onUploadSuccess={handleUploadSuccess}
                                />
                                <FileUploader
                                    label="Carte d'identité"
                                    type="idCard"
                                    dossierId={myRegistration.dossier.id}
                                    currentFile={myRegistration.dossier.documents?.idCard}
                                    onUploadSuccess={handleUploadSuccess}
                                />
                            </div>

                            {/* Show completeness status */}
                            <div style={{ marginTop: '1rem', padding: '1rem', background: myRegistration.dossier.isComplete ? '#d1fae5' : '#fef3c7', borderRadius: '4px' }}>
                                <strong>État du dossier : </strong>
                                {myRegistration.dossier.isComplete ? (
                                    <span style={{ color: '#065f46' }}>Complet - En attente de validation</span>
                                ) : (
                                    <span style={{ color: '#92400e' }}>Incomplet - Veuillez fournir tous les documents</span>
                                )}
                            </div>

                        </div>
                    ) : (
                        <p>Aucune inscription trouvée.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default Dashboard;
