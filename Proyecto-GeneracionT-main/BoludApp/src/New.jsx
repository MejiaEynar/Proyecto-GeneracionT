import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebase"; // 🔹 Importar Firestore
import "./styles/New.css";
import inicioBlack from "./assets/inicioBlack.png";
import inicioWhite from "./assets/inicioWhite.png";

function New(props) {
  const { theme, isLoggedIn, currentUser } = props;
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const LIMITE_CARACTERES = 280;
  const caracteresRestantes = LIMITE_CARACTERES - contenido.length;

  useEffect(() => {
    if (!isLoggedIn) {
      alert('Debes iniciar sesión para publicar un nuevo post.');
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // 🔹 NUEVO: función para agregar publicación a Firestore
  async function agregarPublicacion(nuevaPublicacion) {
    try {
      await addDoc(collection(db, "publicaciones"), nuevaPublicacion);
      console.log("✅ Publicación subida con éxito a Firestore");
    } catch (error) {
      console.error("Error al subir la publicación:", error);
      alert("Error al subir la publicación. Intenta nuevamente.");
    }
  }

  async function handleClick(e) {
    e.preventDefault();
    if (currentUser && contenido) {
      const nuevaPublicacion = {
        usuario: currentUser,
        titulo: titulo,
        contenido: contenido,
        fechaCreacion: new Date(),
        likedBy: [],
      };
      await agregarPublicacion(nuevaPublicacion);
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
              <Link className="inicio" to="/">
                {theme === 'light'
                  ? <img src={inicioBlack} className="Logo" alt="modo claro" />
                  : <img src={inicioWhite} className="Logo" alt="modo oscuro" />}
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <div className='form-New'>
        <form onSubmit={handleClick}>
          <h1>Nuevo Post</h1>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título"
          />
          <textarea
            id="content"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            placeholder="¿Qué estás pensando?"
            maxLength={LIMITE_CARACTERES}
          />
          <p style={{ color: caracteresRestantes < 0 ? 'red' : 'inherit' }}>
            {caracteresRestantes}
          </p>
          <input
            type="submit"
            value="Publicar"
            disabled={!currentUser || !contenido || caracteresRestantes < 0}
          />
        </form>
      </div>
    </>
  );
}

export default New;
