import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import inicioBlack from "./assets/inicioBlack.png"; 
import inicioWhite from "./assets/inicioWhite.png";
import like from './assets/like.png';
import like1 from './assets/like1.png';
import './styles/Buscador.css'
import buscarBlack from './assets/buscar.png';
import buscarWhite from './assets/buscar1.png';
import './styles/App.css';
import "./styles/New.css";

function Buscador(props) {
    // 1. DESESTRUCTURACIÓN: Añadir isLoggedIn y currentUser
    const { 
        admin, 
        theme, 
        publicaciones, 
        setPublicaciones, 
        handleLike,
        isLoggedIn, // << NUEVO
        currentUser // << NUEVO
    } = props;

    // Estados para la búsqueda
    const [searchTerm, setSearchTerm] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Función para manejar la eliminación de posts (copiada de App.jsx)
    const borrarPublicacion = (id) => {
        const publicacionesActualizadas = publicaciones.filter((publicacion) => publicacion.id !== id);
        setPublicaciones(publicacionesActualizadas);
        localStorage.setItem('publicaciones', JSON.stringify(publicacionesActualizadas));
    };

    // Función para activar la búsqueda
    const handleSearchClick = (e) => {
        e.preventDefault();
        setSearchQuery(searchTerm);
    };

    // Lógica de filtrado
    const postsFiltrados = publicaciones
       .slice()
       .reverse()
       .filter(post => {
           // Si searchQuery está vacío, mostramos todas las publicaciones
           if (!searchQuery) return true;

           const term = searchQuery.toLowerCase();

           const titulo = post.titulo ? post.titulo.toLowerCase() : '';
           const contenido = post.contenido ? post.contenido.toLowerCase() : '';
           const usuario = post.usuario ? post.usuario.toLowerCase() : '';

           return titulo.includes(term) || contenido.includes(term) || usuario.includes(term);
       });

    return (
        <div className={theme}>

            <form onSubmit={handleSearchClick} className='search-form-flex'>
                <input
                    type="text"
                    placeholder="Buscar BoludApp"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <button type="submit" className="boton">
                      {theme === 'light' ?  <img src={buscarBlack} className={"Logo"} alt={"buscar"} /> : <img src={buscarWhite} className={"Logo"} alt={"buscar"} /> }
                </button>
            </form>

            <main className={`publicaciones-Inicio ${theme}`}>
                {postsFiltrados && postsFiltrados.length > 0 ? (
                    postsFiltrados.map((publicacion) => {
                        // Lógica del Like (Como en Inicio.jsx)
                        const likedBy = publicacion.likedBy || [];
                        const userHasLiked = isLoggedIn && likedBy.includes(currentUser);
                        const likeCount = likedBy.length;
                        
                        return (
                            <div key={publicacion.id} className='publicacion'>
                                <h1>
                                    <Link to={`/post/${publicacion.id}`}>
                                        {publicacion.titulo}
                                    </Link>
                                </h1>
                                <h4>{publicacion.usuario}</h4>
                                <Markdown remarkPlugins={[remarkGfm]}>{publicacion.contenido}</Markdown>
                                
                                {/* 2. USO DE likedBy EN LUGAR DE likedPosts */}
                                <button className={"boton"} onClick={() => handleLike(publicacion.id)}>
                                    {userHasLiked ?  
                                        <img src={like1} className={"like"} alt={"like activo"} /> : 
                                        <img src={like} className={"like"} alt={"like inactivo"} />
                                    }
                                    {likeCount}
                                </button>
                            </div>
                        )
                    })
                ) : (
                    <h4 className='h4-h4'>
                        {searchQuery ? `No se encontraron resultados para "${searchQuery}".` : 'Empieza a buscar para ver resultados.'}
                    </h4>
                )}
            </main>
            
            {/* Cabecera para volver al inicio */}
            <header className='SearchBar'>
                <nav>
                    <ul>
                        <li>
                            <Link className="inicio" to="/">
                                {theme === 'light' ?  <img src={inicioBlack} className={"Logo"} alt={"Inicio"} /> : <img src={inicioWhite} className={"Logo"} alt={"Inicio"}/> }
                            </Link>
                        </li>
                    </ul>
                </nav>
            </header>
        </div>
    );
}

export default Buscador;
