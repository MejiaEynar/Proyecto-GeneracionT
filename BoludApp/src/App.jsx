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
    // ACEPTA Y UTILIZA LAS PROPS DE SESIÓN Y HANDLERS
    const { admin, toggleTheme, theme, publicaciones, setPublicaciones, likedPosts, handleLike, isLoggedIn, currentUser, handleLogout } = props;

    useEffect(() => {
        const publicacionesGuardadas = JSON.parse(localStorage.getItem('publicaciones')) || [];
        setPublicaciones(publicacionesGuardadas);
    }, []);

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    // ELIMINADO: Los estados isLoggedIn y currentUser NO deben estar aquí.

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
                    publicaciones.map((publicacion) => (
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
                            <button className={"boton"} onClick={() => handleLike(publicacion.id)}>
                                {likedPosts.includes(publicacion.id) ?  <img src={like1} className={"like"} alt={"like"} /> :  <img src={like} className={"like"} alt={"like"} />}{publicacion.likes || 0}
                            </button>
                        </div>
                    ))
                ) : (
                    <h4 className='h4-h4'>No hay Publicaciones</h4>
                )}

            </main>
        </>
    );
}

// All shared state and logic for publications and likes is moved here
function App() {
    const [admin, setAdmin] = useState(false);
    const [theme, setTheme] = useState(
        localStorage.getItem('theme') || 'light'
    );
    const [publicaciones, setPublicaciones] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);

    // AÑADIR LOS ESTADOS DE SESIÓN AL INICIO DE App
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return JSON.parse(localStorage.getItem('isLoggedIn')) || false;
    });
    const [currentUser, setCurrentUser] = useState(() => {
        return localStorage.getItem('currentUser') || '';
    });


    useEffect(() => {
        const publicacionesGuardadas = JSON.parse(localStorage.getItem('publicaciones')) || [];
        setPublicaciones(publicacionesGuardadas);

        // CORRECCIÓN: Se ELIMINAN las líneas que causaban el ReferenceError.
        // localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
        // localStorage.setItem('currentUser', currentUser);

        const likedPostsFromStorage = JSON.parse(localStorage.getItem('likedPosts')) || [];
        setLikedPosts(likedPostsFromStorage);
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
        const isLiked = likedPosts.includes(id);

        let updatedPublicaciones;
        let updatedLikedPosts;

        if (isLiked) {
            updatedPublicaciones = publicaciones.map((publicacion) =>
                publicacion.id === id ? { ...publicacion, likes: Math.max(0, (publicacion.likes || 0) - 1) } : publicacion
            );
            updatedLikedPosts = likedPosts.filter((postId) => postId !== id);
        } else {
            updatedPublicaciones = publicaciones.map((publicacion) =>
                publicacion.id === id ? { ...publicacion, likes: (publicacion.likes || 0) + 1 } : publicacion
            );
            updatedLikedPosts = [...likedPosts, id];
        }

        setPublicaciones(updatedPublicaciones);
        localStorage.setItem('publicaciones', JSON.stringify(updatedPublicaciones));

        setLikedPosts(updatedLikedPosts);
        localStorage.setItem('likedPosts', JSON.stringify(updatedLikedPosts));
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
                likedPosts={likedPosts}
                // Se pasa la versión protegida de handleLike
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
                likedPosts={likedPosts}
                // Se pasa la versión protegida de handleLike
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
                likedPosts={likedPosts}
                // Se pasa la versión protegida de handleLike
                handleLike={isLoggedIn ? handleLike : () => alert('Debes iniciar sesión para dar "Me gusta".')}
            />} />
        </Routes>
    );
}

export default App;