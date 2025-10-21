import {  Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import "./styles/New.css";
import inicioBlack from "./assets/inicioBlack.png";
import inicioWhite from "./assets/inicioWhite.png";

function New(props) {
  const { theme, isLoggedIn, currentUser } = props;
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');

  const [contenido, setContenido] = useState('');
  // ELIMINADO: const [usuario, setUsuario] = useState(''); // <--- ELIMINADO ESTADO REDUNDANTE
  const [publicaciones, setPublicaciones] = useState([]);
  const LIMITE_CARACTERES = 280;
  const caracteresRestantes = LIMITE_CARACTERES - contenido.length;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      alert('Debes iniciar sesión para publicar un nuevo post.');
    }
  }, [isLoggedIn, navigate]);

  function agregarPublicacion(nuevaPublicacion) {
    const publicacionesGuardadas = JSON.parse(localStorage.getItem('publicaciones')) || [];

    const publicacionesActualizadas = [...publicacionesGuardadas, nuevaPublicacion];

    setPublicaciones(publicacionesActualizadas);
    localStorage.setItem('publicaciones', JSON.stringify(publicacionesActualizadas));
  }

  function handleClick(e) {
    e.preventDefault();
    if (currentUser && contenido) {
      const nuevaPublicacion = {
        id: Date.now(),
        usuario: currentUser,
        titulo: titulo,
        contenido: contenido,
      };
      agregarPublicacion(nuevaPublicacion);
      setContenido('');
      setTitulo('');
      navigate('/');
    }
  }

  return (
      <>
        <header className='nav-New'>
          <nav>
            <ul>
              <li>
                <Link className="inicio" to="/">{theme === 'light' ?  <img src={inicioBlack} className={"Logo"} alt={"modo claro"} /> : <img src={inicioWhite} className={"Logo"} alt={"modo oscuro"}/>}</Link>
              </li>
            </ul>
          </nav>
        </header>

        <div className='form-New'>
          <form  onSubmit={handleClick}>
            <h1>Nuevo Post</h1>
            <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Titulo"
            />
            <textarea
                id="content"
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                placeholder="¿Qué estás pensando?"
                maxLength={LIMITE_CARACTERES} // Esto limita la entrada
            />
            <p style={{ color: caracteresRestantes < 0 ? 'red' : 'inherit' }}>
              {caracteresRestantes}
            </p>
            <input
                type="submit"
                value="Publicar"
                // CORRECCIÓN: Usar !currentUser en lugar de !usuario
                disabled={!currentUser || !contenido || caracteresRestantes < 0}
            />
          </form>
        </div>
      </>
  );
}

export default New;