// Archivo: Buscador.jsx (Nuevo Archivo)

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import inicioBlack from "./assets/inicioBlack.png"; // Asume que necesitas estos
import inicioWhite from "./assets/inicioWhite.png";
import like from './assets/like.png';
import like1 from './assets/like1.png';
import './styles/buscador.css'
import buscarBlack from './assets/buscar.png';
import buscarWhite from './assets/buscar1.png';
import './styles/App.css';
import "./styles/New.css";

function Buscador(props) {
    const { admin, theme, publicaciones, setPublicaciones, likedPosts, handleLike } = props;

    // 1. ESTADOS PARA LA BÚSQUEDA
    const [searchTerm, setSearchTerm] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Función para manejar la eliminación de posts (copiada de App.jsx)
    const borrarPublicacion = (id) => {
        const publicacionesActualizadas = publicaciones.filter((publicacion) => publicacion.id !== id);
        setPublicaciones(publicacionesActualizadas);
        localStorage.setItem('publicaciones', JSON.stringify(publicacionesActualizadas));
    };

    // 2. FUNCIÓN PARA ACTIVAR LA BÚSQUEDA
    const handleSearchClick = (e) => {
        e.preventDefault();
        setSearchQuery(searchTerm);
    };

    // 3. LÓGICA DE FILTRADO
    // La lógica de filtrado se mantiene igual, usando las props 'publicaciones'
    const postsFiltrados = publicaciones
       .slice()
       .reverse()
       .filter(post => {
           const term = searchQuery.toLowerCase();
           if (!term) return true;

           const titulo = post.titulo ? post.titulo.toLowerCase() : '';
           const contenido = post.contenido ? post.contenido.toLowerCase() : '';
           const usuario = post.usuario ? post.usuario.toLowerCase() : '';

           return titulo.includes(term) || contenido.includes(term) || usuario.includes(term);
       });

    return (
        <div className={theme}>


            {/* 4. INTERFAZ DEL BUSCADOR */}
            <form onSubmit={handleSearchClick} className='search-form-flex'>
                <input
                    type="text"
                    placeholder="Buscar BoludApp"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <button type="submit" className="boton">
                      {theme === 'light' ?  <img src={buscarBlack} className={"Logo"} alt={"modo oscuro"} /> : <img src={buscarWhite} className={"Logo"} alt={"modo claro"} /> }
                </button>
            </form>

            <main className={`publicaciones-Inicio ${theme}`}>
                {/* 5. RENDERIZADO */}
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
                                {likedPosts.includes(publicacion.id) ?  <img src={like1} className={"like"} alt={"like"} /> :  <img src={like} className={"like"} alt={"like"} />}{publicacion.likes || 0}
                            </button>
                        </div>
                    ))
                ) : (
                    <h4 className='h4-h4'>
                        {searchQuery ? `No se encontraron resultados para "${searchQuery}".` : 'Empieza a buscar...'}
                    </h4>
                )}
            </main>
            <header className='SearchBar'>
                            <nav>
                                <ul>
                                    {/* BOTÓN PARA VOLVER A INICIO */}
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