import { Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Comentar from './Comentar';
import Admin from './Admin';
import './styles/App.css';
import New from './New';

function Inicio(props) {
  const [publicaciones, setPublicaciones] = useState([]);

  useEffect(() => {
    const publicacionesGuardadas = JSON.parse(localStorage.getItem('publicaciones')) || [];
    setPublicaciones(publicacionesGuardadas);
  }, []);

  const handleAgregarPublicacion = (nuevoPost) => {
    setPublicaciones([...publicaciones, nuevoPost]);
    localStorage.setItem('publicaciones', JSON.stringify([...publicaciones, nuevoPost]));
  };

  const borrarPublicacion = (id) => {
    const publicacionesActualizadas = publicaciones.filter((publicacion) => publicacion.id !== id);
    setPublicaciones(publicacionesActualizadas);
    localStorage.setItem('publicaciones', JSON.stringify(publicacionesActualizadas));
  };

  const { admin } = props;

  return (
    <>
      <header className='SearchBar'>
        <nav>
          <ul>
            <li><Link className='Inicio' to='/'>Inicio</Link></li>
              {admin && <p className='admin'>ADMIN</p>}
            <li><Link className='New' to='/new'>New</Link></li>
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
            </div>
          ))
        ) : (
          <h4 className='h4-h4'>No hay Publicaciones</h4>
        )}
      </main>
      <footer>
        <div>
          <p> Sitio construido por Eduardo Orsi, Tiziano Maine y Eynar Mejia de 4° 4° COMPUTACIÓN.</p>
        </div>
      </footer>
    </>
  );
}

function App() {
  const [admin, setAdmin] = useState(false);

  return (
    <Routes>
      <Route path='/' element={<Inicio admin={admin} />} />
      <Route path='/post/:id' element={<Comentar />} />
      <Route path='/new' element={<New />} />
      <Route path='/admin' element={<Admin setAdmin={setAdmin} />} />
    </Routes>
  );
}

export default App;