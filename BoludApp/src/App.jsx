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

    // ESTADOS PARA LA BÚSQUEDA
    const [searchTerm, setSearchTerm] = useState(''); // Lo que se escribe en el input
    const [searchQuery, setSearchQuery] = useState(''); // Lo que se usa para filtrar (se activa con el botón)

    useEffect(() => {
        const publicacionesGuardadas = JSON.parse(localStorage.getItem('publicaciones')) || [];
        setPublicaciones(publicacionesGuardadas);
        setSearchQuery('');
    }, []);

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    const borrarPublicacion = (id) => {
        const publicacionesActualizadas = publicaciones.filter((publicacion) => publicacion.id !== id);
        setPublicaciones(publicacionesActualizadas);
        localStorage.setItem('publicaciones', JSON.stringify(publicacionesActualizadas));
    };

    // FUNCIÓN PARA ACTIVAR LA BÚSQUEDA (CORRECCIÓN DEL ERROR)
    const handleSearchClick = (e) => {
        e.preventDefault();
        setSearchQuery(searchTerm); // Establece el query para activar el filtro
    };

    // LÓGICA DE FILTRADO (Se ejecuta en cada renderizado)
    const postsFiltrados = publicaciones
       .slice()
       .reverse()
       .filter(post => {
           const term = searchQuery.toLowerCase();
           // Si searchQuery está vacío, se muestran todos los posts
           if (!term) return true;

           const titulo = post.titulo ? post.titulo.toLowerCase() : '';
           const contenido = post.contenido ? post.contenido.toLowerCase() : '';
           const usuario = post.usuario ? post.usuario.toLowerCase() : '';

           return titulo.includes(term) || contenido.includes(term) || usuario.includes(term);
       });

    return (
        <>
            <div className={"Imagen"}>
                <img src={Logo} className={"Logo"} alt={"Logo"} />
            </div>
            <header className='SearchBar'>
                <nav>
                    <ul>
                        {admin && <p className='admin'>ADMIN</p>}
                        <li><Link className='New' to='/new'> <img src={postLogo} className={"Logo"} alt={"Crear nuevo post"} /> </Link></li>
                        <li>
                            <button className={"boton"} onClick={toggleTheme}>
                                {theme === 'light' ?  <img src={oscuridad} className={"Logo"} alt={"modo oscuro"} /> : <img src={luz} className={"Logo"} alt={"modo claro"} /> }
                            </button>
                        </li>
                    </ul>
                </nav>
            </header>

            {/* FORMULARIO DE BÚSQUEDA CON BOTÓN */}
            <form onSubmit={handleSearchClick} className='search-form'>
                <input
                    type="text"
                    placeholder="Buscar posts por título, contenido o usuario..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Solo actualiza el texto del input
                    className="search-input"
                />
                <button type="submit" className="search-button">
                    Buscar 🔍
                </button>
            </form>

            <main>
                {/* RENDERIZAR LOS POSTS FILTRADOS */}
                {postsFiltrados && postsFiltrados.length > 0 ? (
                    postsFiltrados.map((publicacion) => (
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
                                {likedPosts.includes(publicacion.id) ?  <img src={like1} className={"like"} alt={"Me gusta"} /> :  <img src={like} className={"like"} alt={"No me gusta"} />}{publicacion.likes || 0}
                            </button>
                        </div>
                    ))
                ) : (
                    <h4 className='h4-h4'>
                        {/* Muestra un mensaje diferente si hay una búsqueda activa sin resultados */}
                        {searchQuery ? `No se encontraron resultados para "${searchQuery}".` : 'No hay Publicaciones'}
                    </h4>
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