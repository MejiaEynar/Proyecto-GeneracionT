import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import inicioBlack from "./assets/inicioBlack.png"; 
import inicioWhite from "./assets/inicioWhite.png";
import like from './assets/like.png';
import like1 from './assets/like1.png';
import './styles/Buscador.css';
import buscarBlack from './assets/buscar.png';
import buscarWhite from './assets/buscar1.png';
import './styles/App.css';
import "./styles/New.css";

// ✅ Función para mostrar la fecha correctamente
const formatDate = (fecha) => {
  if (!fecha) return "Fecha desconocida";
  if (fecha.seconds) return new Date(fecha.seconds * 1000).toLocaleDateString("es-ES");
  if (typeof fecha === "string" || typeof fecha === "number")
    return new Date(fecha).toLocaleDateString("es-ES");
  return "Fecha inválida";
};

function Buscador(props) {
  const { 
    admin, 
    theme, 
    publicaciones, 
    setPublicaciones, 
    handleLike,
    isLoggedIn,
    currentUser,
    usersData // 🔹 Ahora también recibe los datos de los usuarios
  } = props;

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const borrarPublicacion = (id) => {
    const publicacionesActualizadas = publicaciones.filter((publicacion) => publicacion.id !== id);
    setPublicaciones(publicacionesActualizadas);
    localStorage.setItem('publicaciones', JSON.stringify(publicacionesActualizadas));
  };

  const handleSearchClick = (e) => {
    e.preventDefault();
    setSearchQuery(searchTerm);
  };

  const postsFiltrados = publicaciones
    .slice()
    .reverse()
    .filter(post => {
      if (!searchQuery) return true;

      const term = searchQuery.toLowerCase();
      const titulo = post.titulo ? post.titulo.toLowerCase() : '';
      const contenido = post.contenido ? post.contenido.toLowerCase() : '';
      const usuario = post.usuario ? post.usuario.toLowerCase() : '';

      return titulo.includes(term) || contenido.includes(term) || usuario.includes(term);
    });

  return (
    <div className={theme}>
      {/* 🔍 Barra de búsqueda */}
      <form onSubmit={handleSearchClick} className='search-form-flex'>
        <input
          type="text"
          placeholder="Buscar BoludApp"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="boton">
          {theme === 'light' 
            ? <img src={buscarBlack} className="Logo" alt="buscar" /> 
            : <img src={buscarWhite} className="Logo" alt="buscar" />}
        </button>
      </form>

      {/* 🔹 RESULTADOS */}
      <main className={`publicaciones-Inicio ${theme}`}>
        {postsFiltrados && postsFiltrados.length > 0 ? (
          postsFiltrados.map((publicacion) => {
            const likedBy = publicacion.likedBy || [];
            const userHasLiked = isLoggedIn && likedBy.includes(currentUser);
            const likeCount = likedBy.length;

            return (
              <div key={publicacion.id} className='publicacion'>
                {/* 🔹 Nombre y usuario (clickeable) */}
                <h2>
                  <Link to={`/usuario/${publicacion.usuario}`}>
                    {usersData?.[publicacion.usuario]?.name || publicacion.usuario}{" "}
                    <span style={{ color: "gray", fontSize: "0.9em" }}>
                      (@{usersData?.[publicacion.usuario]?.username || `@${publicacion.usuario}`})
                    </span>
                  </Link>
                </h2>

                {/* 🔹 Título + Fecha */}
                <div className='publicacion-header'>
                  <h3>
                    <Link to={`/post/${publicacion.id}`}>
                      {publicacion.titulo}
                    </Link>
                  </h3>

                  {publicacion.fechaCreacion && (
                    <span className='usuario-post-date'>
                      {formatDate(publicacion.fechaCreacion)}
                    </span>
                  )}
                </div>

                {/* 🔹 Contenido Markdown */}
                <Markdown remarkPlugins={[remarkGfm]}>
                  {publicacion.contenido}
                </Markdown>

                {/* 🔹 Botón Like */}
                <button className='boton' onClick={() => handleLike(publicacion.id)}>
                  {userHasLiked ? (
                    <img src={like1} className='like' alt='like activo' />
                  ) : (
                    <img src={like} className='like' alt='like inactivo' />
                  )}
                  {likeCount}
                </button>
              </div>
            );
          })
        ) : (
          <h4 className='h4-h4'>
            {searchQuery ? `No se encontraron resultados para "${searchQuery}".` : 'Empieza a buscar para ver resultados.'}
          </h4>
        )}
      </main>

      {/* 🔙 Volver al inicio */}
      <header className='SearchBar'>
        <nav>
          <ul>
            <li>
              <Link className="inicio" to="/">
                {theme === 'light'
                  ? <img src={inicioBlack} className="Logo" alt="Inicio" />
                  : <img src={inicioWhite} className="Logo" alt="Inicio" />}
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
}

export default Buscador;
