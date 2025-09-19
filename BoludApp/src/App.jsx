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

import New from './New';

function Inicio(props) {
  const { admin, toggleTheme, theme } = props;
  const [publicaciones, setPublicaciones] = useState([]);

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
              <li><Link className='New' to='/new'>New</Link></li>
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
                  </div>
              ))
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
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
      <Routes>
        <Route path='/' element={<Inicio admin={admin} toggleTheme={toggleTheme} theme={theme} />} />
        <Route path='/post/:id' element={<Comentar theme={theme} />} />
        <Route path='/new' element={<New theme={theme} />} />
        <Route path='/admin' element={<Admin setAdmin={setAdmin} theme={theme} />} />
      </Routes>
  );
}

export default App;