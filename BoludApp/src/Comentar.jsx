import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import "./styles/Comentar.css"
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import like1 from "./assets/like1.png";
import like from "./assets/like.png";
import inicioWhite from "./assets/inicioWhite.png"
import inicioBlack from "./assets/inicioBlack.png"


function Comentar(props) {
    const { id } = useParams();
    // RECIBE LAS NUEVAS PROPS DE SESIÓN
    const { publicaciones, likedPosts, handleLike, theme, isLoggedIn, currentUser} = props;
    const navigate = useNavigate(); // Hook de navegación

    // ELIMINADO: const [nombreUsuario, setNombreUsuario] = useState('');
    const [comentario, setComentario] = useState('');
    const [comentarios, setComentarios] = useState([]);
    const [publicacion, setPublicacion] = useState(null);

    // Estado para likes de comentarios (guarda cantidad y si el usuario ya dio like)
    const [likedComentarios, setLikedComentarios] = useState({});

    useEffect(() => {
        const publicacionEncontrada = publicaciones.find((post) => post.id === parseInt(id));
        setPublicacion(publicacionEncontrada);

        const comentariosGuardados = JSON.parse(localStorage.getItem(`comentarios_${id}`)) || [];
        setComentarios(comentariosGuardados);

        // Cargar likes guardados de comentarios
        const likesGuardados = JSON.parse(localStorage.getItem(`likes_comentarios_${id}`)) || {};
        setLikedComentarios(likesGuardados);
    }, [id, publicaciones]);


    function handleComentar() {
        // 1. PROTEGER: Si no está logueado, redirigir
        if (!isLoggedIn) {
            alert('Debes iniciar sesión para comentar.');
            navigate('/login');
            return;
        }

        // 2. Usar currentUser en lugar de nombreUsuario
        if (currentUser && comentario.trim()) {
            const nuevoComentario = {
                nombreUsuario: currentUser, // Usa el usuario logueado
                comentario: comentario,
            };

            const comentariosPublicacion = comentarios || [];
            const comentariosActualizados = [...comentariosPublicacion, nuevoComentario];

            localStorage.setItem(`comentarios_${id}`, JSON.stringify(comentariosActualizados));

            setComentario('');
            // ELIMINADO: setNombreUsuario('');
            setComentarios(comentariosActualizados);
        }
    }

    // Manejar like en comentarios con contador
    function handleLikeComentario(index) {
        // 3. PROTEGER: Si no está logueado, redirigir
        if (!isLoggedIn) {
            alert('Debes iniciar sesión para dar "Me gusta" a un comentario.');
            navigate('/login');
            return;
        }

        const updatedLikes = { ...likedComentarios };

        if (updatedLikes[index]?.liked) {
            // Si ya tenía like, lo quitamos
            updatedLikes[index] = {
                liked: false,
                count: (updatedLikes[index].count || 1) - 1
            };
        } else {
            // Si no tenía like, lo agregamos
            updatedLikes[index] = {
                liked: true,
                count: (updatedLikes[index]?.count || 0) + 1
            };
        }

        setLikedComentarios(updatedLikes);
        localStorage.setItem(`likes_comentarios_${id}`, JSON.stringify(updatedLikes));
    }

    return (
        <>
            <header className='Nav-comentar'>
                <ul>
                    <li>
                        <Link className="inicio" to="/">{theme === 'light' ?  <img src={inicioBlack} className={"Logo"} alt={"modo claro"} /> : <img src={inicioWhite} className={"Logo"} alt={"modo oscuro"}/>}</Link>
                    </li>
                </ul>
            </header>

            <main>
                <section>
                    {publicacion ? (
                        <div key={publicacion.id} className="publicacion">
                            <h4>{publicacion.usuario}</h4>
                            <h3>{publicacion.titulo}</h3>
                            <Markdown remarkPlugins={[remarkGfm]}>{publicacion.contenido}</Markdown>
                            {/* handleLike ya está protegido en App.jsx */}
                            <button className={`boton ${likedPosts.includes(publicacion.id) ? 'liked' : ''}`} onClick={() => handleLike(publicacion.id)}>
                                {likedPosts.includes(publicacion.id) ?  <img src={like1} className={"like"} alt={"like"} /> :  <img src={like} className={"like"} alt={"like"} />}{publicacion.likes || 0} Me gusta
                            </button>
                        </div>
                    ) : (
                        <p>No se encontró la publicación</p>
                    )}
                </section>

                <section>
                    <div className='form-comentarios'>
                        {/* REEMPLAZO DE INPUT DE USUARIO POR MENSAJE DE ESTADO */}
                        {isLoggedIn ? (
                            <p>Comentando como: <strong>{currentUser}</strong></p>
                        ) : (
                            <p className='inicia-sesion-comentar'>Inicia sesión para comentar.</p>
                        )}

                        <textarea
                            onChange={(e) => setComentario(e.target.value)}
                            placeholder={isLoggedIn ? "Comenta algo" : "Inicia sesión para comentar..."}
                            value={comentario}
                            disabled={!isLoggedIn} // Deshabilita si no está logueado
                        />
                        <input
                            type="button"
                            onClick={handleComentar}
                            value="Comentar"
                            className={"botonComentar"}
                            disabled={!isLoggedIn || !comentario.trim()} // Deshabilita si no está logueado o el comentario está vacío
                        />
                    </div>

                    <div className='Comen-title'>
                        <p>Comentarios</p>
                    </div>
                    {comentarios.map((comentario, index) => (
                        <div className='comentarios' key={index}>
                            <p>{comentario.nombreUsuario}</p>
                            <Markdown remarkPlugins={[remarkGfm]}>
                                {comentario.comentario}
                            </Markdown>
                            <button  className={`boton ${likedComentarios[index]?.liked ? 'liked' : ''}`} onClick={() => handleLikeComentario(index)}>
                                {likedComentarios[index]?.liked ? <img src={like1} className={"like"} alt={"like"} /> :  <img src={like} className={"like"} alt={"like"} />} {likedComentarios[index]?.count || 0} Me gusta
                            </button>
                        </div>
                    ))}
                </section>
            </main>
        </>
    );
}

export default Comentar;