import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import "./styles/Comentar.css"
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function Comentar(props) { // Receive props
    const { id } = useParams();
    const { publicaciones, setPublicaciones, likedPosts, handleLike } = props; // Destructure all the props
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [comentario, setComentario] = useState('');
    const [comentarios, setComentarios] = useState([]);
    const [publicacion, setPublicacion] = useState(null);

    // This useEffect will no longer be necessary, as publicaciones is passed down
    useEffect(() => {
        const publicacionEncontrada = publicaciones.filter((post) => post.id === parseInt(id))[0];
        setPublicacion(publicacionEncontrada);

        const comentariosGuardados = JSON.parse(localStorage.getItem(`comentarios_${id}`)) || [];
        setComentarios(comentariosGuardados);
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

    return (
        <>
            <header className='Nav-comentar'>
                <ul>
                    <li>
                        <Link className="inicio" to="/">Inicio</Link>
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
                                <button onClick={() => handleLike(publicacion.id)}>
                                    {likedPosts.includes(publicacion.id) ? '❤️' : '🤍'} Me gusta ({publicacion.likes || 0})
                                </button>
                            </div>
                        )
                        :
                        (
                            <p>no se encontro la publicacion</p>
                        )
                    }
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
                            <Markdown remarkPlugins={[remarkGfm]}>{comentario.comentario}</Markdown>
                           <button onClick={() => handleLike(publicacion.id)}>
                                {likedPosts.includes(publicacion.id) ? '❤️' : '🤍'} Me gusta ({publicacion.likes || 0})
                            </button>
                        </div>
                    ))}
                </section>
            </main>
        </>
    );
}

export default Comentar;