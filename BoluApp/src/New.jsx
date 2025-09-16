import {  Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; 
import { useState } from 'react';
import "./styles/New.css";

function New() {
  const [titulo, setTitulo] = useState('');
  const [usuario, setUsuario] = useState('');
  const [contenido, setContenido] = useState('');
  const [publicaciones, setPublicaciones] = useState([]);

  function agregarPublicacion(nuevaPublicacion) {
    const publicacionesGuardadas = JSON.parse(localStorage.getItem('publicaciones')) || [];
    
    const publicacionesActualizadas = [...publicacionesGuardadas, nuevaPublicacion];

    setPublicaciones(publicacionesActualizadas);
    localStorage.setItem('publicaciones', JSON.stringify(publicacionesActualizadas));
  }

  function handleClick(e) {
    e.preventDefault();
    if (usuario && contenido) {
      const nuevaPublicacion = {
        id: Date.now(),
        usuario: usuario,
        titulo: titulo,
        contenido: contenido,
      };
      agregarPublicacion(nuevaPublicacion);
      setContenido('');
      setTitulo('');
      setUsuario('');
    }
  }

  return (
    <>
        <header className='nav-New'>
          <nav>
            <ul>
              <li><Link className="inicio" to="/">Inicio</Link></li>
            </ul>
          </nav>
        </header>

        <div className='form-New'>
          <form  onSubmit={handleClick}>
            <h1>Nuevo Post</h1>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Usuario"
            />
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
            />
            <input 
              type="submit" 
              value="Publicar" 
            />
      </form>
      <div className='markdown-style'>
        <Markdown remarkPlugins={[remarkGfm]}>{contenido}</Markdown>
      </div>
      </div>
    </>
  );
}

export default New;