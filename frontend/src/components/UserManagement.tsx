import { useState, useEffect } from 'react';
import api from '../services/api';

function UserManagement() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    // Form states
    const [newCoordinator, setNewCoordinator] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'COORDINATOR'
    });
    const [newPassword, setNewPassword] = useState('');

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get('/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch users', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateCoordinator = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await api.post('/users/admin', newCoordinator, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Coordinateur créé avec succès');
            setShowAddModal(false);
            setNewCoordinator({ email: '', password: '', firstName: '', lastName: '', role: 'COORDINATOR' });
            fetchUsers();
        } catch (error: any) {
            alert('Erreur: ' + (error.response?.data?.message || 'Erreur inconnue'));
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await api.patch(`/users/${selectedUser.id}/password`, { password: newPassword }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Mot de passe mis à jour');
            setShowPasswordModal(false);
            setNewPassword('');
            setSelectedUser(null);
        } catch (error: any) {
            alert('Erreur: ' + (error.response?.data?.message || 'Erreur inconnue'));
        }
    };

    if (loading) return <div>Chargement des utilisateurs...</div>;

    return (
        <div className="card" style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Gestion des Utilisateurs</h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={fetchUsers} className="btn" style={{ background: '#3b82f6', fontSize: '0.9rem' }}>Actualiser</button>
                    <button onClick={() => setShowAddModal(true)} className="btn" style={{ background: '#10b981', fontSize: '0.9rem' }}>+ Nouveau Coordinateur</button>
                </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                        <th style={{ padding: '0.5rem' }}>Nom</th>
                        <th style={{ padding: '0.5rem' }}>Email</th>
                        <th style={{ padding: '0.5rem' }}>Rôle</th>
                        <th style={{ padding: '0.5rem' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '0.5rem' }}>{u.firstName} {u.lastName}</td>
                            <td style={{ padding: '0.5rem' }}>{u.email}</td>
                            <td style={{ padding: '0.5rem' }}>
                                <span style={{
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '4px',
                                    backgroundColor: u.role === 'SUPER_ADMIN' ? '#fee2e2' : u.role === 'COORDINATOR' ? '#dbeafe' : '#f3f4f6',
                                    color: u.role === 'SUPER_ADMIN' ? '#991b1b' : u.role === 'COORDINATOR' ? '#1e40af' : '#374151',
                                    fontSize: '0.875rem'
                                }}>
                                    {u.role}
                                </span>
                            </td>
                            <td style={{ padding: '0.5rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => { setSelectedUser(u); setShowPasswordModal(true); }}
                                        style={{ padding: '0.25rem 0.5rem', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Reset Password
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${u.email} ?`)) {
                                                try {
                                                    const token = localStorage.getItem('token');
                                                    await api.delete(`/users/${u.id}`, {
                                                        headers: { Authorization: `Bearer ${token}` }
                                                    });
                                                    setUsers(prev => prev.filter(user => user.id !== u.id));
                                                } catch (error: any) {
                                                    alert('Erreur lors de la suppression: ' + (error.response?.data?.message || 'Erreur inconnue'));
                                                }
                                            }
                                        }}
                                        style={{ padding: '0.25rem 0.5rem', background: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Add Coordinator Modal */}
            {showAddModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '400px' }}>
                        <h3>Ajouter un Coordinateur</h3>
                        <form onSubmit={handleCreateCoordinator}>
                            <div className="form-group">
                                <label>Prénom</label>
                                <input required value={newCoordinator.firstName} onChange={e => setNewCoordinator({ ...newCoordinator, firstName: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Nom</label>
                                <input required value={newCoordinator.lastName} onChange={e => setNewCoordinator({ ...newCoordinator, lastName: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" required value={newCoordinator.email} onChange={e => setNewCoordinator({ ...newCoordinator, email: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Mot de passe</label>
                                <input type="password" required value={newCoordinator.password} onChange={e => setNewCoordinator({ ...newCoordinator, password: e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="submit" className="btn">Créer</button>
                                <button type="button" onClick={() => setShowAddModal(false)} className="btn" style={{ background: '#9ca3af' }}>Annuler</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Reset Password Modal */}
            {showPasswordModal && selectedUser && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '400px' }}>
                        <h3>Réinitialiser mot de passe</h3>
                        <p>Utilisateur: {selectedUser.email}</p>
                        <form onSubmit={handleResetPassword}>
                            <div className="form-group">
                                <label>Nouveau mot de passe</label>
                                <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="submit" className="btn" style={{ background: '#f59e0b' }}>Réinitialiser</button>
                                <button type="button" onClick={() => { setShowPasswordModal(false); setSelectedUser(null); }} className="btn" style={{ background: '#9ca3af' }}>Annuler</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserManagement;
