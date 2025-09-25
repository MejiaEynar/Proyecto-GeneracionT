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

import New from './New';

// This function will now live in App.jsx
function Inicio(props) {
    const { admin, toggleTheme, theme, publicaciones, setPublicaciones, likedPosts, handleLike } = props;

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
                        <li><Link className='New' to='/new'> <img src={postLogo} className={"Logo"} alt={"modo oscuro"} /> </Link></li>
                        <li>
                            <button className={"boton"} onClick={toggleTheme}>
                                {theme === 'light' ?  <img src={oscuridad} className={"Logo"} alt={"modo oscuro"} /> : <img src={luz} className={"Logo"} alt={"modo claro"} /> }
                            </button>
                        </li>
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

    useEffect(() => {
        const publicacionesGuardadas = JSON.parse(localStorage.getItem('publicaciones')) || [];
        setPublicaciones(publicacionesGuardadas);

        const likedPostsFromStorage = JSON.parse(localStorage.getItem('likedPosts')) || [];
        setLikedPosts(likedPostsFromStorage);
    }, []);

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
            <Route path='/' element={<Inicio admin={admin} toggleTheme={toggleTheme} theme={theme} publicaciones={publicaciones} setPublicaciones={setPublicaciones} likedPosts={likedPosts} handleLike={handleLike} />} />
            <Route path='/post/:id' element={<Comentar theme={theme} publicaciones={publicaciones} setPublicaciones={setPublicaciones} likedPosts={likedPosts} handleLike={handleLike} />} />
            <Route path='/new' element={<New theme={theme} />} />
            <Route path='/admin' element={<Admin setAdmin={setAdmin} theme={theme} />} />
        </Routes>
    );
}

export default App;