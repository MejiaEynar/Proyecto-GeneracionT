import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
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
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

// ------------------- COMPONENTE INICIO -------------------

const formatDate = (fecha) => {
  if (!fecha) return "Fecha desconocida";
  if (fecha.seconds) return new Date(fecha.seconds * 1000).toLocaleDateString("es-ES");
  if (typeof fecha === "string" || typeof fecha === "number")
    return new Date(fecha).toLocaleDateString("es-ES");
  return "Fecha inválida";
};



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
		usersData,
		loading,
    } = props;

    const navigate = useNavigate();

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
			{loading ? (
			  <h4 className='h4-h4'>Cargando publicaciones...</h4>
			) : publicaciones && publicaciones.length > 0 ? (
                    publicaciones.map((publicacion) => {
                        const likedBy = publicacion.likedBy || [];
                        const userHasLiked = isLoggedIn && likedBy.includes(currentUser);
                        const likeCount = likedBy.length;

                        return (
                            // ------------------- CÓDIGO CORREGIDO -------------------
                            <div key={publicacion.id} className='publicacion'>

                                {/* 1. INFORMACIÓN DEL USUARIO (Avatar + Nombre/Username) */}
                                <div className='publicacion-usuario-info'>
                                    <Link to={`/usuario/${publicacion.usuario}`} className='usuario-link'>
                                        <img
                                            src={usersData?.[publicacion.usuario]?.avatar || "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png"}
                                            alt="Avatar del usuario"
                                            className='publicacion-avatar'
                                        />
                                        <div>
                                            {/* Nombre */}
                                            <strong>{usersData?.[publicacion.usuario]?.name || publicacion.usuario}</strong>
                                            {/* Username */}
                                            <span className="usuario-username-text" style={{ color: "gray", fontSize: "0.9em" }}>
                    @{usersData?.[publicacion.usuario]?.username || publicacion.usuario}
                </span>
                                        </div>
                                    </Link>
                                </div>

                                {/* 2. HEADER DE LA PUBLICACIÓN (Título y Fecha) */}
                                <div className='publicacion-header'>
                                    <h3>
                                        <Link to={`/post/${publicacion.id}`}>{publicacion.titulo}</Link>
                                    </h3>
                                    {publicacion.fechaCreacion && (
                                        <span className='usuario-post-date'>
              {formatDate(publicacion.fechaCreacion)}
            </span>
                                    )}
                                </div>

                                {/* 3. CONTENIDO Y BOTÓN DE LIKE */}
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
// ------------------- FIN CÓDIGO CORREGIDO -------------------
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
	const [loading, setLoading] = useState(true);
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
	// 1. Inicialización de publicaciones (desde Firestore)
	useEffect(() => {
		setLoading(true);
	  const unsubscribe = onSnapshot(collection(db, "publicaciones"), (snapshot) => {
	    const publicacionesFirestore = snapshot.docs.map(doc => ({
	      id: doc.id,
	      ...doc.data(),
	    }));
	    setPublicaciones(publicacionesFirestore);
	    console.log("📥 Publicaciones cargadas desde Firestore:", publicacionesFirestore.length);
		setLoading(false);
	  });

	  return () => unsubscribe(); // Limpia el listener al desmontar
	}, []);
	

	useEffect(() => {
	  const unsubscribe = onSnapshot(collection(db, "usuarios"), (snapshot) => {
	    const usuariosFirestore = {};
	    snapshot.docs.forEach(doc => {
	      usuariosFirestore[doc.id] = doc.data();
	    });
	    setUsersData(usuariosFirestore);
	    console.log("📥 Usuarios cargados desde Firestore:", Object.keys(usuariosFirestore).length);
	  });

	  return () => unsubscribe();
	}, []);

    // 2. Lógica de Login (CONSOLIDADA y CORREGIDA)
    // En App.jsx, dentro de la función App()

// ...
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
                following: [], // 🟢 CAMBIO: Inicializado como array, no como 0
                followers: [], // 🟢 CAMBIO: Inicializado como array, no como 0
                banner: "https://pbs.twimg.com/profile_banners/44196397/1576183471/1500x500",
                avatar: "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png",
            };
            setUsersData(prev => ({ ...prev, [username]: defaultData }));
            console.log(`[handleLogin] Usuario ${username} inicializado con arrays de following/followers.`); // 🟢 LOG DE VERIFICACIÓN
        }

        navigate('/usuario');
    };
// ...

    // 🆕 Función para seguir/dejar de seguir a un usuario (con console.log para verificación)
    // 🆕 Función para seguir/dejar de seguir a un usuario (con copia profunda de usuarios)
    const handleFollowToggle = (userToFollow) => {
        // Bloqueo si no está logueado o intenta seguirse a sí mismo
        if (!isLoggedIn || !currentUser || currentUser === userToFollow) {
            console.log(`[FollowToggle] Bloqueado.`);
            return;
        }

        setUsersData(prevUsersData => {
            // 🛑 COPIA PROFUNDA: Copiamos solo los objetos de los usuarios a modificar, no solo el mapa.
            const currentUsersData = { ...prevUsersData[currentUser] };
            const targetUsersData = { ...prevUsersData[userToFollow] };

            // Verificación de existencia de datos
            if (!currentUsersData.following || !targetUsersData.followers) {
                console.error(`[FollowToggle] Error: Estructura de datos incompleta para ${currentUser} o ${userToFollow}.`);
                return prevUsersData;
            }

            const currentFollowing = currentUsersData.following;
            const targetFollowers = targetUsersData.followers;
            const isFollowing = currentFollowing.includes(userToFollow);

            if (isFollowing) {
                // Lógica de DEJAR DE SEGUIR
                console.log(`[FollowToggle] 🔴 ${currentUser} va a dejar de seguir a ${userToFollow}`);

                currentUsersData.following = currentFollowing.filter(user => user !== userToFollow);
                targetUsersData.followers = targetFollowers.filter(user => user !== currentUser);

            } else {
                // Lógica de SEGUIR
                console.log(`[FollowToggle] 🟢 ${currentUser} va a seguir a ${userToFollow}`);

                currentUsersData.following = [...currentFollowing, userToFollow];
                targetUsersData.followers = [...targetFollowers, currentUser];
            }

            // 🟢 NUEVO ESTADO: Construimos el nuevo objeto de estado inmutablemente.
            const newUsersData = {
                ...prevUsersData,
                [currentUser]: currentUsersData,
                [userToFollow]: targetUsersData,
            };

            // Log final del estado (el log real del estado se ve mejor fuera de setUsersData)
            console.log(`[FollowToggle] Estado final para ${currentUser}. Siguiendo:`, currentUsersData.following.length);
            console.log(`[FollowToggle] Estado final para ${userToFollow}. Seguidores:`, targetUsersData.followers.length);


            return newUsersData;
        });
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
	const handleLike = async (id) => {
	  if (!isLoggedIn || !currentUser) return;

	  try {
	    // Buscar la publicación actual
	    const publicacion = publicaciones.find((p) => p.id === id);
	    if (!publicacion) return;

	    const likedBy = publicacion.likedBy || [];
	    const userHasLiked = likedBy.includes(currentUser);

	    // Crear el nuevo array actualizado
	    const newLikedBy = userHasLiked
	      ? likedBy.filter((user) => user !== currentUser) // quitar like
	      : [...likedBy, currentUser]; // agregar like

	    // 🔹 Actualizar localmente el estado (para respuesta rápida)
	    setPublicaciones((prev) =>
	      prev.map((p) => (p.id === id ? { ...p, likedBy: newLikedBy } : p))
	    );

	    // 🔹 Actualizar Firestore
	    const postRef = doc(db, "publicaciones", id);
	    await updateDoc(postRef, {
	      likedBy: newLikedBy,
	    });

	    console.log(
	      `❤️ Like ${userHasLiked ? "removido" : "agregado"} por ${currentUser} en post ${id}`
	    );
	  } catch (error) {
	    console.error("Error al actualizar like en Firestore:", error);
	  }
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

// 6. Rutas (Bloque limpio y corregido)
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
						usersData={usersData}
						loading={loading}
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

            {/* 🟢 RUTAS DE USUARIO (CON handleFollowToggle) - CORREGIDO */}
            <Route
                path='/usuario'
                element={
                    <Usuario
                        isLoggedIn={isLoggedIn}
                        currentUser={currentUser}
                        theme={theme}
                        usersData={usersData}
                        admin={admin}
                        publicaciones={publicaciones}
                        handleFollowToggle={handleFollowToggle} // ✅ PROP AÑADIDA
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
                        handleFollowToggle={handleFollowToggle} // ✅ PROP AÑADIDA
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
						usersData={usersData}
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
						usersData={usersData}
                    />
                }
            />
        </Routes>
    );
}

export default App;
