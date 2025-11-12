import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import "./styles/Comentar.css";
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import like1 from "./assets/like1.png";
import like from "./assets/like.png";
import inicioWhite from "./assets/inicioWhite.png";
import inicioBlack from "./assets/inicioBlack.png";
import { db } from "./firebase";
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc } from "firebase/firestore";

function Comentar(props) {
  const { id } = useParams();
  const { publicaciones, handleLike, theme, isLoggedIn, currentUser,  usersData, } = props;
  const navigate = useNavigate();

  const [comentario, setComentario] = useState('');
  const [comentarios, setComentarios] = useState([]);
  const [publicacion, setPublicacion] = useState(null);

  useEffect(() => {
    const publicacionEncontrada = publicaciones.find(
      (post) => post.id === id
    );
    setPublicacion(publicacionEncontrada);
  }, [id, publicaciones]);

  // 🔹 Cargar comentarios en tiempo real desde Firestore
  useEffect(() => {
    if (!id) return;

    const comentariosRef = collection(db, "publicaciones", id, "comentarios");
    const q = query(comentariosRef, orderBy("fechaCreacion", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const comentariosFirestore = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComentarios(comentariosFirestore);
      console.log("💬 Comentarios cargados:", comentariosFirestore.length);
    });

    return () => unsubscribe();
  }, [id]);

  // 🔹 Agregar comentario a Firestore
  async function handleComentar() {
    if (!isLoggedIn) {
      alert('Debes iniciar sesión para comentar.');
      navigate('/login');
      return;
    }

    if (currentUser && comentario.trim()) {
      try {
        const comentariosRef = collection(db, "publicaciones", id, "comentarios");
        await addDoc(comentariosRef, {
          nombreUsuario: currentUser,
          comentario: comentario.trim(),
          fechaCreacion: new Date(),
          likedBy: [], // para likes futuros
        });
        console.log("✅ Comentario agregado a Firestore");
        setComentario('');
      } catch (error) {
        console.error("❌ Error al agregar comentario:", error);
      }
    }
  }

  // 🔹 Dar "like" a un comentario en Firestore
  async function handleLikeComentario(comentarioId) {
    if (!isLoggedIn) {
      alert('Debes iniciar sesión para dar "Me gusta" a un comentario.');
      navigate('/login');
      return;
    }

    const comentarioRef = doc(db, "publicaciones", id, "comentarios", comentarioId);
    const comentarioActual = comentarios.find((c) => c.id === comentarioId);
    if (!comentarioActual) return;

    const likedBy = comentarioActual.likedBy || [];
    const userHasLiked = likedBy.includes(currentUser);

    const newLikedBy = userHasLiked
      ? likedBy.filter((u) => u !== currentUser)
      : [...likedBy, currentUser];

    try {
      await updateDoc(comentarioRef, { likedBy: newLikedBy });
      console.log(`❤️ Like ${userHasLiked ? "removido" : "agregado"} por ${currentUser}`);
    } catch (error) {
      console.error("❌ Error al actualizar like del comentario:", error);
    }
  }

  // 🔹 Lógica de likes de la publicación
  const postLikedBy = publicacion?.likedBy || [];
  const postUserHasLiked = isLoggedIn && postLikedBy.includes(currentUser);
  const postLikeCount = postLikedBy.length;

  return (
    <>
      <header className='Nav-comentar'>
        <ul>
          <li>
            <Link className="inicio" to="/">
              {theme === 'light' ? (
                <img src={inicioBlack} className="Logo" alt="modo claro" />
              ) : (
                <img src={inicioWhite} className="Logo" alt="modo oscuro" />
              )}
            </Link>
          </li>
        </ul>
      </header>

      <main>
        <section>
          {publicacion ? (
            <div key={publicacion.id} className="publicacion">
			<h4>
			  <Link to={`/usuario/${publicacion.usuario}`}>
			    {usersData?.[publicacion.usuario]?.name || publicacion.usuario}{" "}
			    <span style={{ color: "gray", fontSize: "0.9em" }}>
			      (@{usersData?.[publicacion.usuario]?.username || `@${publicacion.usuario}`})
			    </span>
			  </Link>
			</h4>

              <div className='publicacion-header'>
                <h3>{publicacion.titulo}</h3>
                {publicacion.fechaCreacion && (
                  <span className='usuario-post-date'>
                    {new Date(publicacion.fechaCreacion).toLocaleDateString('es-ES')}
                  </span>
                )}
              </div>
              <Markdown remarkPlugins={[remarkGfm]}>{publicacion.contenido}</Markdown>

              <button
                className={`boton ${postUserHasLiked ? 'liked' : ''}`}
                onClick={() => handleLike(publicacion.id)}
              >
                {postUserHasLiked
                  ? <img src={like1} className="like" alt="like" />
                  : <img src={like} className="like" alt="like" />}
                {postLikeCount} Me gusta
              </button>
            </div>
          ) : (
            <p>No se encontró la publicación</p>
          )}
        </section>

        <section>
          <div className='form-comentarios'>
            {isLoggedIn ? (
              <p>Comentando como: <strong>{currentUser}</strong></p>
            ) : (
              <p className='inicia-sesion-comentar'>Inicia sesión para comentar.</p>
            )}

            <textarea
              onChange={(e) => setComentario(e.target.value)}
              placeholder={isLoggedIn ? "Comenta algo" : "Inicia sesión para comentar..."}
              value={comentario}
              disabled={!isLoggedIn}
            />
            <input
              type="button"
              onClick={handleComentar}
              value="Comentar"
              className="botonComentar"
              disabled={!isLoggedIn || !comentario.trim()}
            />
          </div>

          <div className='Comen-title'>
            <p>Comentarios</p>
          </div>

          {comentarios.map((comentario) => {
            const userHasLiked = comentario.likedBy?.includes(currentUser);
            const likeCount = comentario.likedBy?.length || 0;

            return (
              <div className='comentarios' key={comentario.id}>
                <div className='comentario-header'>
				<h4 className='comentario-usuario'>
				  {usersData?.[comentario.nombreUsuario]?.name || comentario.nombreUsuario}{" "}
				  <span style={{ color: "gray", fontSize: "0.9em" }}>
				    ({usersData?.[comentario.nombreUsuario]?.username || `@${comentario.nombreUsuario}`})
				  </span>
				</h4>
                  {comentario.fechaCreacion && (
                    <span className='usuario-post-date'>
                      {new Date(comentario.fechaCreacion.seconds
                        ? comentario.fechaCreacion.seconds * 1000
                        : comentario.fechaCreacion).toLocaleDateString('es-ES')}
                    </span>
                  )}
                </div>

                <div className='comentario-contenido'>
                  <Markdown remarkPlugins={[remarkGfm]}>
                    {comentario.comentario}
                  </Markdown>
                </div>

                <button
                  className={`boton ${userHasLiked ? 'liked' : ''}`}
                  onClick={() => handleLikeComentario(comentario.id)}
                >
                  {userHasLiked
                    ? <img src={like1} className="like" alt="like" />
                    : <img src={like} className="like" alt="like" />}
                  {likeCount} Me gusta
                </button>
              </div>
            );
          })}
        </section>
      </main>
    </>
  );
}

export default Comentar;
