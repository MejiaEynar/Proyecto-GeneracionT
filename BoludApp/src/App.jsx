import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Comentar from './Comentar';
import Admin from './Admin';
import './styles/App.css';
import Logo from './assets/LdNR.png';
import luz from './assets/luz.png';
import oscuridad from './assets/oscuridad.png';
import like from './assets/like.png';
import like1 from './assets/like1.png';
import postLogo from './assets/postLogo.png';
import Buscador from './Buscador';
import AdminDashboard from './AdminDashboard';
import New from './New';
import Login from './Login';
import buscarBlack from './assets/buscar.png';
import buscarWhite from './assets/buscar1.png';
import iniciar1 from './assets/iniciar1.png';
import iniciar2 from './assets/iniciar2.png';
import Usuario from './Usuario';
import EditarPerfil from './EditarPerfil';

// ------------------- COMPONENTE INICIO -------------------
function Inicio(props) {
    const {
        admin,
        toggleTheme,
        theme,
        publicaciones,
        setPublicaciones,
        handleLike,
        isLoggedIn,
        currentUser,
        handleLogout,
    } = props;

    const navigate = useNavigate();

    useEffect(() => {
        const publicacionesGuardadas = JSON.parse(localStorage.getItem('publicaciones')) || [];
        setPublicaciones(publicacionesGuardadas);
    }, []);

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    const borrarPublicacion = (id) => {
        const publicacionesActualizadas = publicaciones.filter((p) => p.id !== id);
        setPublicaciones(publicacionesActualizadas);
        localStorage.setItem('publicaciones', JSON.stringify(publicacionesActualizadas));
    };

    const irAPerfil = () => {
        navigate('/usuario');
    };

    // 🔹 Nuevo: función para manejar el botón de crear publicación
    const manejarNuevaPublicacion = () => {
        if (!isLoggedIn) {
            // Reemplazo de alert()
            // En una aplicación real, usarías un modal o MessageBox
            alert('Debes iniciar sesión para crear una publicación.');
            return;
        }
        navigate('/new'); // ✅ solo si está logueado
    };
    const loadAllUsersData = () => {
        const accounts = JSON.parse(localStorage.getItem("accounts")) || {};
        const defaultUsersData = {};
        Object.keys(accounts).forEach(username => {
            defaultUsersData[username] = {
                name: username,
                username: `@${username.toLowerCase()}`,
                bio: "",
                joined: "Fecha Desconocida", // Considera guardar esta fecha en Login.jsx
                following: 0,
                followers: 0,
                banner: "URL_POR_DEFECTO",
                avatar: "URL_POR_DEFECTO",
            };
        });
        return defaultUsersData;
    };
    return (
        <>
            <div className='Perfil'>
                {isLoggedIn ? (
                    <>
                        <li>
                            <button onClick={irAPerfil} className='boton'>
                                {theme === 'light' ? (
                                    <img src={iniciar2} className='Logo' alt='perfil' />
                                ) : (
                                    <img src={iniciar1} className='Logo' alt='perfil' />
                                )}
                            </button>
                        </li>
                        <li>
                            <button onClick={handleLogout} className='boton'>
                                Cerrar sesión
                            </button>
                        </li>
                    </>
                ) : (
                    <li>
                        <Link className='Usuario' to='/login'>
                            {theme === 'light' ? (
                                <img src={iniciar2} className='Logo' alt='login' />
                            ) : (
                                <img src={iniciar1} className='Logo' alt='login' />
                            )}
                        </Link>
                    </li>
                )}
            </div>

            <div className='Imagen'>
                <img src={Logo} className='Logo' alt='Logo' />
            </div>

            <footer className='SearchBar'>
                <nav>
                    <ul>
                        {admin && <p className='admin'>ADMIN</p>}
                        <li>
                            <button className='boton' onClick={manejarNuevaPublicacion}>
                                <img src={postLogo} className='Logo' alt='crear' />
                            </button>
                        </li>

                        <li>
                            <button className='boton' onClick={toggleTheme}>
                                {theme === 'light' ? (
                                    <img src={oscuridad} className='Logo' alt='modo oscuro' />
                                ) : (
                                    <img src={luz} className='Logo' alt='modo claro' />
                                )}
                            </button>
                        </li>

                        <li>
                            <Link className='Buscador' to='/buscador'>
                                {theme === 'light' ? (
                                    <img src={buscarBlack} className='Logo' alt='buscar' />
                                ) : (
                                    <img src={buscarWhite} className='Logo' alt='buscar' />
                                )}
                            </Link>
                        </li>
                    </ul>
                </nav>
            </footer>

            <main>
                {publicaciones && publicaciones.length > 0 ? (
                    publicaciones.map((publicacion) => {
                        const likedBy = publicacion.likedBy || [];
                        const userHasLiked = isLoggedIn && likedBy.includes(currentUser);
                        const likeCount = likedBy.length;

                        return (
                            <div key={publicacion.id} className='publicacion'>
                                <h2>
                                    <Link to={`/usuario/${publicacion.usuario}`}>{publicacion.usuario}</Link>
                                </h2>
                                <h3>
                                    <Link to={`/post/${publicacion.id}`}>{publicacion.titulo}</Link>
                                </h3>
                                <Markdown remarkPlugins={[remarkGfm]}>
                                    {publicacion.contenido}
                                </Markdown>
                                <button className='boton' onClick={() => handleLike(publicacion.id)}>
                                    {userHasLiked ? (
                                        <img src={like1} className='like' alt='like' />
                                    ) : (
                                        <img src={like} className='like' alt='like' />
                                    )}
                                    {likeCount}
                                </button>
                            </div>
                        );
                    })
                ) : (
                    <h4 className='h4-h4'>No hay Publicaciones</h4>
                )}
            </main>
        </>
    );
}

function App() {
    const [admin, setAdmin] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [publicaciones, setPublicaciones] = useState([]);

    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return JSON.parse(localStorage.getItem('isLoggedIn')) || false;
    });
    const [currentUser, setCurrentUser] = useState(() => {
        return localStorage.getItem('currentUser') || '';
    });

    // 🆕 Estado para guardar datos de todos los usuarios (bio, name, joined, etc.)
    const [usersData, setUsersData] = useState(() => {
        return JSON.parse(localStorage.getItem('usersData')) || {};
    });

    const navigate = useNavigate();

    // 🔄 Sincronizar usersData con localStorage
    useEffect(() => {
        localStorage.setItem('usersData', JSON.stringify(usersData));
    }, [usersData]);

    // 1. Inicialización de publicaciones (MANTENIDO)
    useEffect(() => {
        let publicacionesGuardadas = JSON.parse(localStorage.getItem('publicaciones')) || [];

        publicacionesGuardadas = publicacionesGuardadas.map((p) => {
            if (typeof p.likedBy === 'undefined') {
                return { ...p, likedBy: [] };
            }
            return p;
        });

        setPublicaciones(publicacionesGuardadas);
    }, []);

    // 2. Lógica de Login (CONSOLIDADA y CORREGIDA)
    const handleLogin = (username) => {
        setIsLoggedIn(true);
        setCurrentUser(username);
        localStorage.setItem('isLoggedIn', JSON.stringify(true));
        localStorage.setItem('currentUser', username);

        // ✅ Al iniciar sesión, inicializar datos si es la primera vez (para la fecha de registro)
        if (!usersData[username]) {
            const defaultData = {
                name: username,
                username: `@${username.toLowerCase()}`,
                bio: "",
                // 📅 FECHA ACTUAL DE INICIO DE SESIÓN
                joined: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long' }),
                following: 0,
                followers: 0,
                banner: "https://pbs.twimg.com/profile_banners/44196397/1576183471/1500x500",
                avatar: "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png",
            };
            setUsersData(prev => ({ ...prev, [username]: defaultData }));
        }

        navigate('/usuario');
    };

    // 3. Lógica de Logout (CONSOLIDADA)
    const handleLogout = () => {
        setIsLoggedIn(false);
        setCurrentUser('');
        setAdmin(false);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        navigate('/');
    };

    // 🆕 Función para actualizar el perfil de usuario
    const handleEditProfile = (username, newFields) => {
        setUsersData(prev => ({
            ...prev,
            [username]: {
                ...prev[username],
                ...newFields, // Sobrescribe name, bio, banner, avatar
            }
        }));
    };

    // 4. Lógica de Like (MANTENIDA)
    const handleLike = (id) => {
        if (!isLoggedIn || !currentUser) return;

        const publicacion = publicaciones.find((p) => p.id === id);
        if (!publicacion) return;

        const likedBy = publicacion.likedBy || [];
        const userHasLiked = likedBy.includes(currentUser);

        const updatedPublicaciones = publicaciones.map((p) =>
            p.id === id
                ? {
                    ...p,
                    likedBy: userHasLiked
                        ? likedBy.filter((user) => user !== currentUser)
                        : [...likedBy, currentUser],
                }
                : p
        );

        setPublicaciones(updatedPublicaciones);
        localStorage.setItem('publicaciones', JSON.stringify(updatedPublicaciones));
    };

    // 5. Lógica del Tema (MANTENIDA)
    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };
    // 🔹 Función centralizada para eliminar publicaciones (usada por el AdminDashboard)
    const handleDeletePost = (id, deletedBy) => {
        const publicacionesGuardadas = JSON.parse(localStorage.getItem('publicaciones')) || [];
        const deletedPublicaciones = JSON.parse(localStorage.getItem('deletedPublicaciones')) || [];
        const postToDelete = publicacionesGuardadas.find(p => p.id === id);

        if (postToDelete) {
            // 1. Registrar en lista de eliminadas (para métricas)
            localStorage.setItem('deletedPublicaciones', JSON.stringify([
                ...deletedPublicaciones,
                { ...postToDelete, deletedBy, deletedAt: new Date().toISOString() }
            ]));

            // 2. Eliminar del array principal
            const publicacionesActualizadas = publicacionesGuardadas.filter(p => p.id !== id);
            setPublicaciones(publicacionesActualizadas);
            localStorage.setItem('publicaciones', JSON.stringify(publicacionesActualizadas));
            return true;
        }
        return false;
    };

    // 6. Rutas
    return (
        <Routes>
            <Route
                path='/'
                element={
                    <Inicio
                        admin={admin}
                        toggleTheme={toggleTheme}
                        theme={theme}
                        publicaciones={publicaciones}
                        setPublicaciones={setPublicaciones}
                        // Reemplazo de alert()
                        handleLike={isLoggedIn ? handleLike : () => alert('Debes iniciar sesión para dar "Me gusta".')}
                        isLoggedIn={isLoggedIn}
                        currentUser={currentUser}
                        handleLogout={handleLogout}
                    />
                }
            />

            <Route path='/login' element={<Login theme={theme} handleLogin={handleLogin} />} />
            {/* RUTA PARA EL DASHBOARD DE ADMIN */}
            <Route
                path='/dashboard-admin'
                element={
                    admin ? (
                        <AdminDashboard
                            theme={theme}
                            setAdmin={setAdmin}
                            handleDeletePost={handleDeletePost}
                        />
                    ) : (
                        <Admin setAdmin={setAdmin} theme={theme} />
                    )
                }
            />

            <Route
                path='/usuario'
                element={
                    <Usuario
                        isLoggedIn={isLoggedIn}
                        currentUser={currentUser}
                        theme={theme}
                        usersData={usersData}// <<--- PASAR LOS DATOS DE TODOS LOS USUARIOS
                        admin={admin}// 🆕 Pasar los datos globales
                        publicaciones={publicaciones}
                    />
                }
            />
            <Route
                path='/usuario/:username'
                element={
                    <Usuario
                        isLoggedIn={isLoggedIn}
                        currentUser={currentUser}
                        theme={theme}
                        usersData={usersData}
                        admin={admin}
                        publicaciones={publicaciones}
                    />
                }
            />

            {/* 🆕 NUEVA RUTA DE EDICIÓN DE PERFIL */}
            <Route
                path='/editar-perfil'
                element={
                    <EditarPerfil
                        theme={theme}
                        currentUser={currentUser}
                        usersData={usersData}
                        handleEditProfile={handleEditProfile} // Función para guardar cambios
                        isLoggedIn={isLoggedIn}
                    />
                }
            />

            <Route
                path='/new'
                element={<New theme={theme} isLoggedIn={isLoggedIn} currentUser={currentUser} />}
            />

            <Route
                path='/post/:id'
                element={
                    <Comentar
                        theme={theme}
                        publicaciones={publicaciones}
                        setPublicaciones={setPublicaciones}
                        // Reemplazo de alert()
                        handleLike={isLoggedIn ? handleLike : () => alert('Debes iniciar sesión para dar "Me gusta" a la publicación.')}
                        isLoggedIn={isLoggedIn}
                        currentUser={currentUser}
                    />
                }
            />

            <Route path='/admin' element={<Admin setAdmin={setAdmin} theme={theme} />} />

            <Route
                path='/buscador'
                element={
                    <Buscador
                        admin={admin}
                        toggleTheme={toggleTheme}
                        theme={theme}
                        publicaciones={publicaciones}
                        setPublicaciones={setPublicaciones}
                        handleLike={isLoggedIn ? handleLike : () => alert('Debes iniciar sesión para dar "Me gusta".')}
                        handleDeletePost={handleDeletePost} // 👈 agregado
                    />
                }
            />
            />
        </Routes>
    );
}

export default App;
