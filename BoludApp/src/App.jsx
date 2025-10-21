import { Routes, Route, Link } from 'react-router-dom';
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
import postLogo from './assets/postLogo.png'
import Buscador from './Buscador';
import New from './New';
import Login from './Login';
import buscarBlack from './assets/buscar.png';
import buscarWhite from './assets/buscar1.png';

function Inicio(props) {
    const { admin, toggleTheme, theme, publicaciones, setPublicaciones, handleLike, isLoggedIn, currentUser, handleLogout } = props;

     useEffect(() => {
        const publicacionesGuardadas = JSON.parse(localStorage.getItem('publicaciones')) || [];
        setPublicaciones(publicacionesGuardadas);
    }, []);

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    const borrarPublicacion = (id) => {
        const publicacionesActualizadas = publicaciones.filter((publicacion) => publicacion.id !== id);
        setPublicaciones(publicacionesActualizadas);
        localStorage.setItem('publicaciones', JSON.stringify(publicacionesActualizadas));
    };

    return (
        <>
            <div className={"Imagen"}>
                <img src={Logo} className={"Logo"} alt={"Logo"} />
            </div>
            <header className='SearchBar'>

                <nav>
                    <ul>
                        {admin && <p className='admin'>ADMIN</p>}

                        {/* LÓGICA DE SESIÓN EN LA BARRA DE NAVEGACIÓN */}
                        {isLoggedIn ? (
                            <>
                                <li><button onClick={handleLogout} className='logout-button'>Cerrar Sesión</button></li>
                            </>
                        ) : (
                            <li><Link className='Login' to='/login'>Iniciar Sesión</Link></li>
                        )}

                        <li><Link className='New' to='/new'> <img src={postLogo} className={"Logo"} alt={"modo oscuro"} /> </Link></li>
                        <li>
                            <button className={"boton"} onClick={toggleTheme}>
                                {theme === 'light' ?  <img src={oscuridad} className={"Logo"} alt={"modo oscuro"} /> : <img src={luz} className={"Logo"} alt={"modo claro"} /> }
                            </button>
                        </li>
                        <li><Link className='Buscador' to='/buscador'>{theme === 'light' ?  <img src={buscarBlack} className={"Logo"} alt={"modo oscuro"} /> : <img src={buscarWhite} className={"Logo"} alt={"modo claro"} />}</Link></li>

                    </ul>
                </nav>

            </header>
            <main>
                {publicaciones && publicaciones.length > 0 ? (
                    publicaciones.map((publicacion) => {
                        // NUEVA LÓGICA: Determinar el estado del like basado en publicacion.likedBy
                        const likedBy = publicacion.likedBy || [];
                        const userHasLiked = isLoggedIn && likedBy.includes(currentUser);
                        const likeCount = likedBy.length; // El conteo se deriva de la longitud del array

                        return (
                            <div key={publicacion.id} className='publicacion'>
                                <h1>
                                    <Link to={`/post/${publicacion.id}`}>
                                        {publicacion.titulo}
                                    </Link>
                                    {admin && (
                                        <button className='remove' id={publicacion.id} onClick={() => borrarPublicacion(publicacion.id)}>X</button>)}
                                </h1>
                                <h4>{publicacion.usuario}</h4>
                                <Markdown remarkPlugins={[remarkGfm]}>{publicacion.contenido}</Markdown>
                                {/* Botón usa el nuevo estado y conteo */}
                                <button className={"boton"} onClick={() => handleLike(publicacion.id)}>
                                    {userHasLiked ?  <img src={like1} className={"like"} alt={"like"} /> :  <img src={like} className={"like"} alt={"like"} />}{likeCount}
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
    const [theme, setTheme] = useState(
        localStorage.getItem('theme') || 'light'
    );
    const [publicaciones, setPublicaciones] = useState([]);

    // AÑADIR LOS ESTADOS DE SESIÓN AL INICIO DE App
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return JSON.parse(localStorage.getItem('isLoggedIn')) || false;
    });
    const [currentUser, setCurrentUser] = useState(() => {
        return localStorage.getItem('currentUser') || '';
    });


    useEffect(() => {
        let publicacionesGuardadas = JSON.parse(localStorage.getItem('publicaciones')) || [];

        publicacionesGuardadas = publicacionesGuardadas.map(p => {
            if (typeof p.likedBy === 'undefined') {
                return { ...p, likedBy: [] };
            }
            return p;
        });

        setPublicaciones(publicacionesGuardadas);

    }, []);

    const handleLogin = (username) => {
        setIsLoggedIn(true);
        setCurrentUser(username);
        localStorage.setItem('isLoggedIn', JSON.stringify(true));
        localStorage.setItem('currentUser', username);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setCurrentUser('');
        setAdmin(false);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
    };
    const handleLike = (id) => {
        if (!isLoggedIn || !currentUser) return; // Doble chequeo, aunque ya está protegido en las rutas

        const publicacion = publicaciones.find((p) => p.id === id);
        if (!publicacion) return;

        const likedBy = publicacion.likedBy || [];
        const userHasLiked = likedBy.includes(currentUser);

        let updatedPublicaciones;

        if (userHasLiked) {
            const newLikedBy = likedBy.filter((user) => user !== currentUser);
            updatedPublicaciones = publicaciones.map((p) =>
                p.id === id ? { ...p, likedBy: newLikedBy } : p
            );
        } else {
            const newLikedBy = [...likedBy, currentUser];
            updatedPublicaciones = publicaciones.map((p) =>
                p.id === id ? { ...p, likedBy: newLikedBy } : p
            );
        }

        setPublicaciones(updatedPublicaciones);
        // Persistir el cambio en localStorage
        localStorage.setItem('publicaciones', JSON.stringify(updatedPublicaciones));

        // ELIMINADO: Ya no se actualiza likedPosts
    };
    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <Routes>
            <Route path='/' element={<Inicio
                admin={admin}
                toggleTheme={toggleTheme}
                theme={theme}
                publicaciones={publicaciones}
                setPublicaciones={setPublicaciones}
                handleLike={isLoggedIn ? handleLike : () => alert('Debes iniciar sesión para dar "Me gusta".')}
                isLoggedIn={isLoggedIn}
                currentUser={currentUser}
                handleLogout={handleLogout} // Se pasa el handler
            />} />

            <Route path='/login' element={<Login
                theme={theme}
                handleLogin={handleLogin}
            />} />

            <Route path='/new' element={<New
                theme={theme}
                isLoggedIn={isLoggedIn}
                currentUser={currentUser}
            />} />

            <Route path='/post/:id' element={<Comentar
                theme={theme}
                publicaciones={publicaciones}
                setPublicaciones={setPublicaciones}
                handleLike={isLoggedIn ? handleLike : () => alert('Debes iniciar sesión para dar "Me gusta" a la publicación.')}
                isLoggedIn={isLoggedIn}
                currentUser={currentUser}
            />} />

            <Route path='/admin' element={<Admin setAdmin={setAdmin} theme={theme} />} />

            <Route path='/buscador' element={<Buscador
                admin={admin}
                toggleTheme={toggleTheme}
                theme={theme}
                publicaciones={publicaciones}
                setPublicaciones={setPublicaciones}
                handleLike={isLoggedIn ? handleLike : () => alert('Debes iniciar sesión para dar "Me gusta".')}
            />} />
        </Routes>
    );
}

export default App;