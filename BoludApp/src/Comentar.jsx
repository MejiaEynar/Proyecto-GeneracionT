import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import "./styles/Comentar.css"
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import like1 from "./assets/like1.png";
import like from "./assets/like.png";
import inicioWhite from "./assets/inicioWhite.png"
import inicioBlack from "./assets/inicioBlack.png"


function Comentar(props) {
    const { id } = useParams();
    const { publicaciones, likedPosts, handleLike, theme} = props;
    const [nombreUsuario, setNombreUsuario] = useState('');
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
        if (nombreUsuario && comentario) {
            const nuevoComentario = {
                nombreUsuario: nombreUsuario,
                comentario: comentario,
            };

            const comentariosPublicacion = comentarios || [];
            const comentariosActualizados = [...comentariosPublicacion, nuevoComentario];

            localStorage.setItem(`comentarios_${id}`, JSON.stringify(comentariosActualizados));

            setComentario('');
            setNombreUsuario('');
            setComentarios(comentariosActualizados);
        }
    }

    // Manejar like en comentarios con contador
    function handleLikeComentario(index) {
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
                            <button className={"boton"} onClick={() => handleLike(publicacion.id)}>
                                {likedPosts.includes(publicacion.id) ?  <img src={like1} className={"like"} alt={"like"} /> :  <img src={like} className={"like"} alt={"like"} />}{publicacion.likes || 0} Me gusta
                            </button>
                        </div>
                    ) : (
                        <p>No se encontró la publicación</p>
                    )}
                </section>

                <section>
                    <div className='form-comentarios'>
                        <input
                            type="text"
                            value={nombreUsuario}
                            onChange={(e) => setNombreUsuario(e.target.value)}
                            placeholder="Nombre de usuario"
                        />
                        <textarea
                            onChange={(e) => setComentario(e.target.value)}
                            placeholder="Comenta algo"
                            value={comentario}
                        />
                        <input
                            type="button"
                            onClick={handleComentar}
                            value="Comentar"
                            className={"botonComentar"}
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
                            <button className={"boton"} onClick={() => handleLikeComentario(index)}>
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
