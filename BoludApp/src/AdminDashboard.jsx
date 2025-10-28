import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/DashboardAdmin.css';
import './styles/Buscador.css';
import './styles/App.css';

function AdminDashboard ({ theme, setAdmin, handleDeletePost }) {
    const navigate = useNavigate();

    // 1. Declaración de Estados (La parte que faltaba)
    const [metrics, setMetrics] = useState({
        totalTwits: 0,
        totalAccounts: 0,
        deletedTwits: 0,
        deletedAccounts: 0,
    });
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // 2. Función de Carga de Datos (Incluida en la lógica anterior)
    const loadData = useCallback(() => {
        // --- Cargar Cuentas ---
        const storedAccounts = JSON.parse(localStorage.getItem('accounts')) || {};
        const allAccounts = Object.keys(storedAccounts).map(username => ({
            username: username,
            id: username,
            email: `${username}@boludapp.com`,
        }));

        const deletedAccounts = JSON.parse(localStorage.getItem('deletedAccounts')) || [];

        // --- Cargar Publicaciones ---
        const publicaciones = JSON.parse(localStorage.getItem('publicaciones')) || [];
        const deletedPublicaciones = JSON.parse(localStorage.getItem('deletedPublicaciones')) || [];

        // --- Actualizar Estados ---
        setMetrics({
            totalTwits: publicaciones.length,
            totalAccounts: allAccounts.length,
            deletedTwits: deletedPublicaciones.length,
            deletedAccounts: deletedAccounts.length,
        });
        setUsers(allAccounts);

    }, []);

    // 3. Efecto para Cargar Datos al inicio
    useEffect(() => {
        loadData();
    }, [loadData]);

    // 4. Lógica de Navegación y Eliminación (Incluida en la lógica anterior)
    const handleViewUser = (username) => {
        navigate(`/usuario/${username}`);
    };

    const handleDeleteAccount = (username) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar la cuenta de @${username}?`)) {
            // Eliminar cuenta del almacenamiento principal
            const storedAccounts = JSON.parse(localStorage.getItem('accounts')) || {};
            delete storedAccounts[username];
            localStorage.setItem('accounts', JSON.stringify(storedAccounts));

            // Añadir cuenta a la lista de eliminados
            const deletedAccounts = JSON.parse(localStorage.getItem('deletedAccounts')) || [];
            deletedAccounts.push(username);
            localStorage.setItem('deletedAccounts', JSON.stringify(deletedAccounts));

            // Recargar datos y forzar un logout (si es el admin quien se elimina)
            loadData();
            alert(`La cuenta de @${username} ha sido eliminada permanentemente.`);
        }
    };

    // 5. Lógica de Filtrado (Incluida en la lógica anterior)
    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`admin-dashboard ${theme}`}>
            {/* ... Encabezado (sin cambios) ... */}

            {/* KPI Grid */}
            <div className='dash-kpi-grid'>
                <div className='dash-kpi-card'>
                    <div className='dash-kpi-title'>Total de Twits</div>
                    <div className='dash-kpi-value'>{metrics.totalTwits}</div> {/* ¡Ahora existe! */}
                </div>
                <div className='dash-kpi-card'>
                    <div className='dash-kpi-title'>Cuentas Activas</div>
                    <div className='dash-kpi-value'>{metrics.totalAccounts}</div>
                </div>
                <div className='dash-kpi-card'>
                    <div className='dash-kpi-title'>Twits Eliminados</div>
                    <div className='dash-kpi-value'>{metrics.deletedTwits}</div>
                </div>
                <div className='dash-kpi-card'>
                    <div className='dash-kpi-title'>Cuentas Eliminadas</div>
                    <div className='dash-kpi-value'>{metrics.deletedAccounts}</div>
                </div>
            </div>

            {/* User Account Management */}
            <div className='dash-user-table-container'>
                <h2 className='dash-table-title'>Gestión de Cuentas de Usuario</h2>

                {/* Search Input (usa clases de Buscador.css) */}
                <div className='user-search search-form-flex'>
                    <input
                        type="text"
                        placeholder="Buscar por nombre de usuario..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='search-input'
                    />
                </div>

                {/* Users Table */}
                <div style={{ marginTop: '20px' }}>
                    <table className='dash-user-table'>
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>ID</th>
                                <th>Email</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* ... mapeo de usuarios ... */}
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td data-label="Usuario">{user.username}</td>
                                        <td data-label="ID">{user.id}</td>
                                        <td data-label="Email">{user.email}</td>
                                        <td data-label="Acciones">
                                            <button
                                                className='dash-action-button dash-btn-view'
                                                onClick={() => handleViewUser(user.username)}
                                            >
                                                Revisar
                                            </button>
                                            <button
                                                className='dash-action-button dash-btn-delete'
                                                onClick={() => handleDeleteAccount(user.username)}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                                        No se encontraron usuarios que coincidan con la búsqueda.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;