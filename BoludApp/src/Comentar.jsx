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
    // CORRECCIÓN 1: Se elimina 'likedPosts' de la desestructuración de props.
    const { publicaciones, handleLike, theme, isLoggedIn, currentUser} = props;
    const navigate = useNavigate();

    const [comentario, setComentario] = useState('');
    const [comentarios, setComentarios] = useState([]);
    const [publicacion, setPublicacion] = useState(null);

    // Estado para likes de comentarios:
    // Almacena: { indiceComentario: { count: N, likedBy: ['userA', 'userB', ...] } }
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
            setComentarios(comentariosActualizados);
        }
    }

    // CORRECCIÓN 3: Se aplica la lógica de likes por cuenta/usuario para comentarios
    function handleLikeComentario(index) {
        // 3. PROTEGER: Si no está logueado, redirigir
        if (!isLoggedIn) {
            alert('Debes iniciar sesión para dar "Me gusta" a un comentario.');
            navigate('/login');
            return;
        }

        const updatedLikes = { ...likedComentarios };
        const currentLikes = updatedLikes[index] || { count: 0, likedBy: [] }; // Inicializar si no existe
        const userHasLiked = currentLikes.likedBy.includes(currentUser); // Comprobar si el usuario actual ya dio like

        if (userHasLiked) {
            // Si ya tenía like, lo quitamos
            updatedLikes[index] = {
                count: currentLikes.count - 1,
                // Quitar el usuario del array likedBy
                likedBy: currentLikes.likedBy.filter(user => user !== currentUser)
            };
        } else {
            // Si no tenía like, lo agregamos
            updatedLikes[index] = {
                count: currentLikes.count + 1,
                // Agregar el usuario al array likedBy
                likedBy: [...currentLikes.likedBy, currentUser]
            };
        }

        setLikedComentarios(updatedLikes);
        localStorage.setItem(`likes_comentarios_${id}`, JSON.stringify(updatedLikes));
    }


    // LÓGICA DE VISUALIZACIÓN DE LIKES DE PUBLICACIÓN (necesaria para el render)
    const postLikedBy = publicacion?.likedBy || [];
    const postUserHasLiked = isLoggedIn && postLikedBy.includes(currentUser);
    const postLikeCount = postLikedBy.length;


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
                            <h4><Link to={`/usuario/${publicacion.usuario}`}>{publicacion.usuario}</Link></h4>
                            <h3>{publicacion.titulo}</h3>
                            <Markdown remarkPlugins={[remarkGfm]}>{publicacion.contenido}</Markdown>
                            {/* CORRECCIÓN 2: Se usa la nueva lógica likedBy */}
                            <button
                                className={`boton ${postUserHasLiked ? 'liked' : ''}`}
                                onClick={() => handleLike(publicacion.id)}
                            >
                                {postUserHasLiked ?  <img src={like1} className={"like"} alt={"like"} /> :  <img src={like} className={"like"} alt={"like"} />}{postLikeCount} Me gusta
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
                    {/* El mapeo de comentarios usa la lógica de likedBy para comentarios */}
                    {comentarios.map((comentario, index) => {
                        // Determinar si el usuario actual dio like para el estilo del botón
                        const currentCommentLikes = likedComentarios[index] || { count: 0, likedBy: [] };
                        const userHasLiked = currentCommentLikes.likedBy.includes(currentUser);

                        return (
                            <div className='comentarios' key={index}>
                                <p>{comentario.nombreUsuario}</p>
                                <Markdown remarkPlugins={[remarkGfm]}>
                                    {comentario.comentario}
                                </Markdown>
                                <button  className={`boton ${userHasLiked ? 'liked' : ''}`} onClick={() => handleLikeComentario(index)}>
                                    {userHasLiked ? <img src={like1} className={"like"} alt={"like"} /> :  <img src={like} className={"like"} alt={"like"} />} {currentCommentLikes.count} Me gusta
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