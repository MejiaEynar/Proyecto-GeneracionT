import React, { useState, useEffect, useCallback } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './styles/DashboardAdmin.css';
import './styles/Buscador.css';
import './styles/App.css';
import inicioBlack from "./assets/inicioBlack.png";
import inicioWhite from "./assets/inicioWhite.png";

function AdminDashboard({ theme, setAdmin }) {
    const navigate = useNavigate();

    // === ESTADOS ===
    const [metrics, setMetrics] = useState({
        totalTwits: 0,
        totalAccounts: 0,
        deletedTwits: 0,
        deletedAccounts: 0,
    });

    const [users, setUsers] = useState([]);
    const [twits, setTwits] = useState([]);
    const [searchUser, setSearchUser] = useState('');
    const [searchTwit, setSearchTwit] = useState('');

    // === CARGA DE DATOS ===
    const loadData = useCallback(() => {
        // --- Cargar cuentas ---
        const storedAccounts = JSON.parse(localStorage.getItem('accounts')) || {};
        const allAccounts = Object.keys(storedAccounts).map(username => ({
            username: username,
            id: username,
            email: `${username}@boludapp.com`,
        }));
        const deletedAccounts = JSON.parse(localStorage.getItem('deletedAccounts')) || [];

        // --- Cargar publicaciones ---
        const publicaciones = JSON.parse(localStorage.getItem('publicaciones')) || [];
        const deletedPublicaciones = JSON.parse(localStorage.getItem('deletedPublicaciones')) || [];

        setMetrics({
            totalTwits: publicaciones.length,
            totalAccounts: allAccounts.length,
            deletedTwits: deletedPublicaciones.length,
            deletedAccounts: deletedAccounts.length,
        });

        setUsers(allAccounts);
        setTwits(publicaciones);
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

useEffect(() => {
  document.body.className = theme;
}, [theme]);


    // === ACCIONES USUARIOS ===
    const handleViewUser = (username) => navigate(`/usuario/${username}`);

    const handleDeleteAccount = (username) => {
        if (window.confirm(`¿Eliminar la cuenta de @${username}?`)) {
            const storedAccounts = JSON.parse(localStorage.getItem('accounts')) || {};
            delete storedAccounts[username];
            localStorage.setItem('accounts', JSON.stringify(storedAccounts));

            const deletedAccounts = JSON.parse(localStorage.getItem('deletedAccounts')) || [];
            deletedAccounts.push(username);
            localStorage.setItem('deletedAccounts', JSON.stringify(deletedAccounts));

            loadData();
            alert(`La cuenta de @${username} ha sido eliminada.`);
        }
    };

    // === ACCIONES TWITS ===
    const handleRevisarTwit = (id) => navigate(`/post/${id}`);

    const handleDeleteTwit = (id) => {
        if (window.confirm('¿Eliminar este twit?')) {
            const publicaciones = JSON.parse(localStorage.getItem('publicaciones')) || [];
            const updated = publicaciones.filter((p) => p.id !== id);
            localStorage.setItem('publicaciones', JSON.stringify(updated));

            const deletedPublicaciones = JSON.parse(localStorage.getItem('deletedPublicaciones')) || [];
            const eliminado = publicaciones.find(p => p.id === id);
            if (eliminado) deletedPublicaciones.push(eliminado);
            localStorage.setItem('deletedPublicaciones', JSON.stringify(deletedPublicaciones));

            loadData();
            alert('El twit ha sido eliminado correctamente.');
        }
    };

    // === FILTROS ===
    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchUser.toLowerCase())
    );

    const filteredTwits = twits.filter(t =>
        t.usuario.toLowerCase().includes(searchTwit.toLowerCase()) ||
        t.contenido.toLowerCase().includes(searchTwit.toLowerCase())
    );

    // === RENDER ===
    return (

        <div className={`App ${theme}`}>
            <header className='Nav-comentar'>
                <ul>
                    <li>
                        <Link className="inicio" to="/">{theme === 'light' ?  <img src={inicioBlack} className={"Logo"} alt={"modo claro"} /> : <img src={inicioWhite} className={"Logo"} alt={"modo oscuro"}/>}</Link>
                    </li>
                </ul>
            </header>
            {/* === MÉTRICAS === */}
            <div className='dash-kpi-grid'>
                <div className='dash-kpi-card'>
                    <div className='dash-kpi-title'>Total de Twits</div>
                    <div className='dash-kpi-value'>{metrics.totalTwits}</div>
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

            {/* === GESTIÓN DE USUARIOS === */}
            <div className='dash-user-table-container'>
                <h2 className='dash-table-title'>Gestión de Cuentas de Usuario</h2>
                <div className='user-search search-form-flex'>
                    <input
                        type="text"
                        placeholder="Buscar por nombre de usuario..."
                        value={searchUser}
                        onChange={(e) => setSearchUser(e.target.value)}
                        className='search-input'
                    />
                </div>

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
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td>{user.username}</td>
                                <td>{user.id}</td>
                                <td>{user.email}</td>
                                <td>
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
                            <td colSpan="4" style={{ textAlign: 'center' }}>No se encontraron usuarios.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* === GESTIÓN DE TWITS === */}
            <div className='dash-user-table-container'>
                <h2 className='dash-table-title'>Gestión de Twits</h2>
                <div className='user-search search-form-flex'>
                    <input
                        type="text"
                        placeholder="Buscar por usuario o contenido..."
                        value={searchTwit}
                        onChange={(e) => setSearchTwit(e.target.value)}
                        className='search-input'
                    />
                </div>

                <table className='dash-user-table'>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Usuario</th>
                        <th>Contenido</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredTwits.length > 0 ? (
                        filteredTwits.map((t) => (
                            <tr key={t.id}>
                                <td>{t.id}</td>
                                <td>{t.usuario}</td>
                                <td className="contenido-celda">{t.contenido}</td>
                                <td>
                                    <button
                                        className='dash-action-button dash-btn-view'
                                        onClick={() => handleRevisarTwit(t.id)}
                                    >
                                        Revisar
                                    </button>
                                    <button
                                        className='dash-action-button dash-btn-delete'
                                        onClick={() => handleDeleteTwit(t.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center' }}>No hay twits registrados.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>

    );
}

export default AdminDashboard;
